<!DOCTYPE html>
<html>
<head>
    <title>Simple Marker</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css" />
    <link rel="stylesheet" type="text/css" href="http://www.cityplanner.it/experiment_host/php/qgis2leaf/main_map/css/own_style_full.css">
    <link rel="stylesheet" href="Control.SimpleMarkers.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="Control.SimpleMarkers.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" /></script> <!--inserimento jquery-->

</head>
<body>
    <div id="map"></div><!--div crea una divisione logica nel documento creando una sezione specifica alla quale sto assegnando l'id map che definisco in larghezza e altezza-->

    <script>
        //creo una mappa con relativa posizione e zoom iniziali(http://dbsgeo.com/latlon/)
        var map = L.map('map').setView([45.81216, 8.61173], 13);//var indica che la variabile è locale,ha valore solo all’interno della funzione in cui viene dichiarata. La chiamo map e gli dico che è una mappa da mettere nella divisione(div) con id map e il metodo setview che passa coordinate del centro e livello dello zoom

        L.tileLayer(
            'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
            maxZoom: 18,
            }).addTo(map);

        var marker_controls = new L.Control.SimpleMarkers();//var indica che la variabile è locale,ha valore solo all’interno della funzione in cui viene dichiarata. La chiamo marker_controls e gli dico che è una mappa da mettere nella divisione(div) con id map e il metodo setview che passa coordinate del centro e livello dello zoom
        map.addControl(marker_controls); //aggiunge alla mappa i pulsanti per aggiungere ed eliminare i marker specificati in marker_controls

        // variabile per definire l'icona in base al tipo di punto
        function getStatoIcon(dat) {
          return  dat === 'ghiaccio'   ? 'http://www.cityplanner.it/supply/icon_web/mapbox-maki-51d4f10/renders/mobilephone-24@2x.png' :
                  dat === 'frana'   ? 'http://www.cityplanner.it/supply/icon_web/mapbox-maki-51d4f10/renders/wetland-24@2x.png' :
                  'http://www.cityplanner.it/supply/icon_web/mapbox-maki-51d4f10/src/park-24.svg';
        }

        function carica_geojson(){
          // carica il file geojson col metodo jQuery
          $.getJSON("poi_protezionecivile.geojson", function(data) {
            var geojson = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                  // crea un punto e definisce l'icona per ogni punto
                  return L.marker(latlng, {
                      icon: L.icon({
                        iconUrl: getStatoIcon(feature.properties.tipo),
                        iconSize: [24, 28],
                        iconAnchor: [12, 28],
                        popupAnchor: [0, -25]
                      }),
                      //
                      title: feature.properties.tipo,
                      riseOnHover: true
                   });
              },
              onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.tipo);
              }
            });
            geojson.addTo(map);
          });
        }

        $(document).ready(function() {
          carica_geojson();
        });

    </script>
</body>
</html>
