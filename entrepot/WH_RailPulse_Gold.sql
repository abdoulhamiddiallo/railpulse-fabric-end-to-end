-- RAILPULSE | WH_RailPulse_Gold | Script 1 : tables de contrôle
CREATE TABLE dbo.cfg_emission_factor (
    mode_code     varchar(10)  NOT NULL,
    mode_label    varchar(40)  NOT NULL,
    g_co2_per_pkm decimal(9,2) NOT NULL
);
INSERT INTO dbo.cfg_emission_factor VALUES
    ('TRAIN', 'Train à grande vitesse', 6.00),
    ('AVION', 'Avion court-courrier', 180.00);

CREATE TABLE dbo.etl_run_log (
    run_id        varchar(64)  NOT NULL,
    step_name     varchar(60)  NOT NULL,
    rows_loaded   bigint       NULL,
    logged_at     datetime2(6) NOT NULL
);

-- Table d'ancrage des mesures DAX : une ligne, une colonne masquée dans le modèle sémantique
CREATE TABLE dbo.mesures (valeur int NOT NULL);
INSERT INTO dbo.mesures VALUES (1);
-- RAILPULSE | Script 2 : procédure de chargement Gold (schéma en étoile)
CREATE OR ALTER PROCEDURE dbo.usp_Load_Gold @run_id varchar(64)
AS
BEGIN
    DECLARE @train decimal(9,2) = (SELECT g_co2_per_pkm FROM dbo.cfg_emission_factor WHERE mode_code = 'TRAIN');
    DECLARE @avion decimal(9,2) = (SELECT g_co2_per_pkm FROM dbo.cfg_emission_factor WHERE mode_code = 'AVION');

    -- Dimension Date : 457 jours (01/10/2025 au 31/12/2026) générés sans boucle par une table de nombres
    DROP TABLE IF EXISTS dbo.dim_date;
    CREATE TABLE dbo.dim_date AS
    SELECT CAST(CONVERT(varchar(8), dt, 112) AS int)            AS date_key,
           dt                                                   AS [date],
           YEAR(dt)                                             AS [year],
           MONTH(dt)                                            AS month_num,
           CAST(CASE MONTH(dt) WHEN 1 THEN 'janvier' WHEN 2 THEN 'février' WHEN 3 THEN 'mars'
                WHEN 4 THEN 'avril' WHEN 5 THEN 'mai' WHEN 6 THEN 'juin' WHEN 7 THEN 'juillet'
                WHEN 8 THEN 'août' WHEN 9 THEN 'septembre' WHEN 10 THEN 'octobre'
                WHEN 11 THEN 'novembre' ELSE 'décembre' END AS varchar(12)) AS month_name,
           YEAR(dt) * 100 + MONTH(dt)                           AS year_month,
           CAST(CASE MONTH(dt) WHEN 1 THEN 'janv.' WHEN 2 THEN 'févr.' WHEN 3 THEN 'mars' WHEN 4 THEN 'avr.'
                WHEN 5 THEN 'mai' WHEN 6 THEN 'juin' WHEN 7 THEN 'juil.' WHEN 8 THEN 'août' WHEN 9 THEN 'sept.'
                WHEN 10 THEN 'oct.' WHEN 11 THEN 'nov.' ELSE 'déc.' END
                + ' ' + RIGHT(CAST(YEAR(dt) AS varchar(4)), 2) AS varchar(12)) AS month_label,   -- « oct. 25 », trié par year_month
           DATEDIFF(day, '2024-12-30', dt) % 7 + 1              AS weekday_num,   -- 1 = lundi
           CAST(CASE DATEDIFF(day, '2024-12-30', dt) % 7 WHEN 0 THEN 'lundi' WHEN 1 THEN 'mardi'
                WHEN 2 THEN 'mercredi' WHEN 3 THEN 'jeudi' WHEN 4 THEN 'vendredi'
                WHEN 5 THEN 'samedi' ELSE 'dimanche' END AS varchar(10)) AS weekday_name,
           CAST(CASE WHEN DATEDIFF(day, '2024-12-30', dt) % 7 >= 5 THEN 1 ELSE 0 END AS bit) AS is_weekend
    FROM (SELECT DATEADD(day, a.v + b.v * 10 + c.v * 100, CAST('2025-10-01' AS date)) AS dt
          FROM (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) a(v)
          CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) b(v)
          CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) c(v)
          WHERE a.v + b.v * 10 + c.v * 100 <= 456) d;

    DROP TABLE IF EXISTS dbo.dim_station;
    CREATE TABLE dbo.dim_station AS
    SELECT station_code, station_name, city, country_code, country_name,
           CAST(latitude AS decimal(9,6)) AS latitude, CAST(longitude AS decimal(9,6)) AS longitude, is_hub
    FROM LH_RailPulse_Silver.dbo.silver_stations;

    DROP TABLE IF EXISTS dbo.dim_route;
    CREATE TABLE dbo.dim_route AS
    SELECT DISTINCT t.origin + '-' + t.destination                AS route_key,
           t.line_code, t.origin, t.destination,
           o.city + ' > ' + d.city                                AS route_name,
           t.distance_km,
           CAST(CASE WHEN o.country_code <> d.country_code THEN 1 ELSE 0 END AS bit) AS is_cross_border
    FROM LH_RailPulse_Silver.dbo.silver_trips t
    JOIN LH_RailPulse_Silver.dbo.silver_stations o ON o.station_code = t.origin
    JOIN LH_RailPulse_Silver.dbo.silver_stations d ON d.station_code = t.destination;

    DROP TABLE IF EXISTS dbo.dim_trainset;
    CREATE TABLE dbo.dim_trainset AS
    SELECT trainset_id, series, CAST(commissioning_year AS int) AS commissioning_year,
           CAST(trainset_age AS int) AS trainset_age
    FROM LH_RailPulse_Silver.dbo.silver_trainsets;

    -- Fait : un train
    DROP TABLE IF EXISTS dbo.fact_trip;
    CREATE TABLE dbo.fact_trip AS
    SELECT t.trip_id,
           CAST(CONVERT(varchar(8), t.service_date, 112) AS int)    AS date_key,
           t.origin + '-' + t.destination                          AS route_key,
           t.trainset_id,
           CAST(t.scheduled_departure AS datetime2(6))             AS scheduled_departure,
           t.dep_hour, t.is_peak,
           CAST(t.is_cancelled AS bit)                             AS is_cancelled,
           t.arrival_delay_min,
           CAST(CASE WHEN t.is_cancelled = 0 AND t.arrival_delay_min <= 5 THEN 1 ELSE 0 END AS bit) AS is_on_time,
           t.seats,
           COALESCE(p.passengers, 0)                               AS passengers,
           CAST(COALESCE(p.revenue_eur, 0) AS decimal(18,2))       AS revenue_eur,
           CAST(COALESCE(p.passengers, 0) AS bigint) * t.distance_km AS passenger_km,
           CAST(COALESCE(p.passengers, 0) * t.distance_km * (@avion - @train) / 1000.0 AS decimal(18,2)) AS co2_avoided_kg
    FROM LH_RailPulse_Silver.dbo.silver_trips t
    LEFT JOIN (SELECT trip_id, SUM(passengers) AS passengers, SUM(revenue_eur) AS revenue_eur
               FROM LH_RailPulse_Silver.dbo.silver_bookings GROUP BY trip_id) p ON p.trip_id = t.trip_id;

    -- Fait : réservations (train x classe x canal)
    DROP TABLE IF EXISTS dbo.fact_booking;
    CREATE TABLE dbo.fact_booking AS
    SELECT b.trip_id, f.date_key, f.route_key,
           CAST(CASE b.travel_class WHEN 1 THEN '1re classe' ELSE '2de classe' END AS varchar(12)) AS travel_class,
           b.channel, b.passengers, CAST(b.revenue_eur AS decimal(18,2)) AS revenue_eur, b.avg_lead_days
    FROM LH_RailPulse_Silver.dbo.silver_bookings b
    JOIN dbo.fact_trip f ON f.trip_id = b.trip_id;

    -- Fait : prévisions du modèle de machine learning
    DROP TABLE IF EXISTS dbo.fact_delay_forecast;
    CREATE TABLE dbo.fact_delay_forecast AS
    SELECT trip_id,
           CAST(CONVERT(varchar(8), service_date, 112) AS int)     AS date_key,
           origin + '-' + destination                              AS route_key,
           trainset_id,
           CAST(scheduled_departure AS datetime2(6))               AS scheduled_departure,
           weather_severity, load_factor, predicted_delay_min, risk_level, model_version
    FROM LH_RailPulse_Silver.dbo.ml_delay_forecast;

    INSERT INTO dbo.etl_run_log
    SELECT @run_id, 'fact_trip', COUNT_BIG(*), SYSUTCDATETIME() FROM dbo.fact_trip
    UNION ALL SELECT @run_id, 'fact_booking', COUNT_BIG(*), SYSUTCDATETIME() FROM dbo.fact_booking
    UNION ALL SELECT @run_id, 'fact_delay_forecast', COUNT_BIG(*), SYSUTCDATETIME() FROM dbo.fact_delay_forecast;
END;
-- RAILPULSE | Script 3 : vues de lecture
CREATE OR ALTER VIEW dbo.vw_headline AS
SELECT COUNT_BIG(*)                                                   AS trains,
       SUM(passengers)                                                AS passagers,
       SUM(revenue_eur)                                               AS chiffre_affaires_eur,
       CAST(100.0 * SUM(CAST(is_on_time AS int)) / NULLIF(SUM(CASE WHEN is_cancelled = 0 THEN 1 ELSE 0 END), 0) AS decimal(5,2)) AS ponctualite_pct,
       CAST(SUM(co2_avoided_kg) / 1000 AS decimal(18,0))              AS co2_evite_tonnes
FROM dbo.fact_trip;
CREATE OR ALTER VIEW dbo.vw_line_scorecard AS
SELECT r.line_code, r.route_name,
       COUNT_BIG(*)                                                       AS trains,
       SUM(f.passengers)                                                  AS passagers,
       CAST(AVG(CASE WHEN f.is_cancelled = 0 THEN 1.0 * f.arrival_delay_min END) AS decimal(6,2)) AS retard_moyen_min,
       CAST(100.0 * SUM(CAST(f.is_on_time AS int)) / NULLIF(SUM(CASE WHEN f.is_cancelled = 0 THEN 1 ELSE 0 END), 0) AS decimal(5,2)) AS ponctualite_pct,
       CAST(SUM(f.revenue_eur) / NULLIF(SUM(f.passenger_km), 0) AS decimal(9,4)) AS recette_par_voyageur_km
FROM dbo.fact_trip f JOIN dbo.dim_route r ON r.route_key = f.route_key
GROUP BY r.line_code, r.route_name;
