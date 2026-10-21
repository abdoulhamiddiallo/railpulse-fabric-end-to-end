// RAILPULSE | DF_RailPulse_Reference | Dataflow Gen2 (Power Query M)
// Lit deux tables Bronze, les enrichit d'un libellé lisible, et les écrit dans LH_RailPulse_Silver (mode Remplacer).
// Destinations : silver_stations et silver_weather, schéma dynamique, V-Order activé.

section Section1;

// Gares : ajoute le nom du pays à partir de son code ISO
shared silver_stations = let
  Source = Lakehouse.Contents(null),
  Navigation = Source{[workspaceId = "<ID_ESPACE_DE_TRAVAIL>"]}[Data],
  #"Navigation 1" = Navigation{[lakehouseId = "<ID_LH_RailPulse_Bronze>"]}[Data],
  #"Navigation 2" = #"Navigation 1"{[Id = "bronze_stations", ItemKind = "Table"]}[Data],
  #"Colonne personnalisée ajoutée" = Table.AddColumn(#"Navigation 2", "country_name", each
      if [country_code] = "FR" then "France"
      else if [country_code] = "LU" then "Luxembourg"
      else if [country_code] = "BE" then "Belgique"
      else if [country_code] = "NL" then "Pays-Bas"
      else if [country_code] = "DE" then "Allemagne"
      else if [country_code] = "CH" then "Suisse"
      else "Italie"),
  #"Type de colonne changé" = Table.TransformColumnTypes(#"Colonne personnalisée ajoutée", {{"country_name", type text}})
in
  #"Type de colonne changé";

// Météo : traduit la sévérité 0 à 3 en libellé
shared silver_weather = let
  Source = Lakehouse.Contents(null),
  Navigation = Source{[workspaceId = "<ID_ESPACE_DE_TRAVAIL>"]}[Data],
  #"Navigation 1" = Navigation{[lakehouseId = "<ID_LH_RailPulse_Bronze>"]}[Data],
  #"Navigation 2" = #"Navigation 1"{[Id = "bronze_weather", ItemKind = "Table"]}[Data],
  #"Colonne personnalisée ajoutée" = Table.TransformColumnTypes(
      Table.AddColumn(#"Navigation 2", "weather_label", each
          if [severity] = 0 then "Calme"
          else if [severity] = 1 then "Perturbé"
          else if [severity] = 2 then "Dégradé"
          else "Sévère"),
      {{"weather_label", type text}})
in
  #"Colonne personnalisée ajoutée";
