L.Control.SimpleMarkers = L.Control.extend({
    options: {
        position: 'topright'
    },

  onAdd: function () {
    var marker_container = L.DomUtil.create('div', 'marker_controls');

    //la funzione crea una variabile add_marker_div che accede
    /*
     * Qui di seguito i nuovi marker vanno diversificati come variabile
     * ma devono essere aggiunti tutti a "add_marker_control"
     *
     */
    var add_marker_div = L.DomUtil.create('div', 'add_marker_control', marker_container);
    var add_marker_div_ghiaccio = L.DomUtil.create('div', 'add_marker_control_ghiaccio', marker_container);
    var add_marker_div_frana = L.DomUtil.create('div', 'add_marker_control_frana', marker_container);

    var del_marker_div = L.DomUtil.create('div', 'del_marker_control', marker_container);

    add_marker_div.title = 'Add a marker';
    add_marker_div_ghiaccio.title = 'Add a marker ghiaccio';
    add_marker_div_frana.title = 'Add a marker frana';

    del_marker_div.title = 'Delete a marker';

    L.DomEvent.addListener(add_marker_div, 'click', L.DomEvent.stopPropagation)
      .addListener(add_marker_div, 'click', L.DomEvent.preventDefault)
      .addListener(add_marker_div, 'click', (function () { this.enterAddMarkerMode() }).bind(this));

    L.DomEvent.addListener(add_marker_div_ghiaccio, 'click', L.DomEvent.stopPropagation)//il metodo Aggiunge listener, interfaccia che contiene i metodi relativi
    //al tipo di evento che si vuole intercettare(Una volta creata una implementazione dell' interfaccia basta installarla nel controllo grafico da cui
    //vogliamo intercettare gli eventi)  to the element's DOM click. this keyword inside the listener will point to context,
    // or to the element if not specified
    //il metodo stoppropagation Stop the given event from propagation to parent elements
      .addListener(add_marker_div_ghiaccio, 'click', L.DomEvent.preventDefault)
      .addListener(add_marker_div_ghiaccio, 'click', (function () { this.enterAddMarkerModeGhiaccio() }).bind(this));

    L.DomEvent.addListener(add_marker_div_frana, 'click', L.DomEvent.stopPropagation)
      .addListener(add_marker_div_frana, 'click', L.DomEvent.preventDefault)
      .addListener(add_marker_div_frana, 'click', (function () { this.enterAddMarkerModeFrana() }).bind(this));


    L.DomEvent.addListener(del_marker_div, 'click', L.DomEvent.stopPropagation)
        .addListener(del_marker_div, 'click', L.DomEvent.preventDefault)
        .addListener(del_marker_div, 'click', (function () { this.enterDelMarkerMode() }).bind(this));

    return marker_container;
  },

/*
 * Ok, fino a qui ho inserito dei nuovi elementi, lasciando quello originale
 * Funziona ancora tutto, ma non si vedono i nuovi pulsanti
 *
 */


  enterAddMarkerMode: function () {
      if (markerList !== '') {
          for (var marker = 0; marker < markerList.length; marker++) {
              if (typeof(markerList[marker]) !== 'undefined') {
                  markerList[marker].removeEventListener('click', this.onMarkerClickDelete);
              }
          }
      }
      document.getElementById('map').style.cursor = 'crosshair';
      map.addEventListener('click', this.onMapClickAddMarker);
  },

  enterAddMarkerModeGhiaccio: function () {
       if (markerList !== '') { //se markerlist non è vuota
          for (var marker = 0; marker < markerList.length; marker++) {//inizio un ciclo che per la variabile locale marker che va da 0 a meno della lunghezza di markerlist con incremento 1
               if (typeof(markerList[marker]) !== 'undefined') {//se il tipo di markerlist alla posizione marker è definito
                   markerList[marker].removeEventListener('click', this.onMarkerClickDelete);//markerList in posizione marker rimuove il listener che al click attivava onMarkerClickDelete
               }
           }
       }
       document.getElementById('map').style.cursor = 'crosshair';//metto lo stile del cursore sull'elemento mappa a croce
       map.addEventListener('click', this.onMapClickAddMarkerGhiaccio);//passa alla funzione onMapClickAddMarker
   },

   enterAddMarkerModeFrana: function () {
       if (markerList !== '') {
           for (var marker = 0; marker < markerList.length; marker++) {
               if (typeof(markerList[marker]) !== 'crosshair') {
                   markerList[marker].removeEventListener('click', this.onMarkerClickDelete);
               }
           }
       }
       document.getElementById('map').style.cursor = 'crosshair';
       map.addEventListener('click', this.onMapClickAddMarkerFrana);
   },

  enterDelMarkerMode: function () {
      for (var marker = 0; marker < markerList.length; marker++) {
          if (typeof(markerList[marker]) !== 'undefined') {
              markerList[marker].addEventListener('click', this.onMarkerClickDelete);
          }
      }
  },

  onMapClickAddMarkerGhiaccio: function (e) { //la funzione riceve come argomento l'evento e
    map.removeEventListener('click'); // si fa smettere di gestire il click sull'elemento map
    document.getElementById('map').style.cursor = 'auto';// si rimette lo stile del cursore sull'elemento mappa a quello originale

    var popupContent =  "Punto ghiaccio inserito con successo!";
    var the_popup = L.popup({maxWidth: 160, closeButton: false});
    the_popup.setContent(popupContent);

    //var marker = L.marker(e.latlng);// creo una variabile locale marker e gli passo le coordinate e.latlng di L.marker
    var marker = L.circle(e.latlng, 100, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0
    }).addTo(map);
    //marker.addTo(map);
    marker.bindPopup(the_popup).openPopup();

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    var tipo = "ghiaccio";
    console.log(lat);

    //https://jhoyimperial.wordpress.com/2008/07/28/parsing-json-data-from-php-using-jquery/
    $.getJSON("crea_poi_protezionecivile.php?tipo="+tipo+"&lat="+lat+"&lng="+lng+"");

    carica_geojson();

    markerList.push(marker); // aggiunge marker(variabile locale) a markerlist
    return false;
  },


    onMapClickAddMarkerFrana: function (e) { //la funzione riceve come argomento l'evento e
      map.removeEventListener('click'); // si fa smettere di gestire il click sull'elemento map
      document.getElementById('map').style.cursor = 'auto';// si rimette lo stile del cursore sull'elemento mappa a quello originale

      var popupContent =  "Punto frana inserito con successo!";
      var the_popup = L.popup({maxWidth: 160, closeButton: false});
      the_popup.setContent(popupContent);

      //var marker = L.marker(e.latlng);// creo una variabile locale marker e gli passo le coordinate e.latlng di L.marker
      var marker = L.circle(e.latlng, 100, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0
      }).addTo(map);
      //marker.addTo(map);
      marker.bindPopup(the_popup).openPopup();

      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var tipo = "frana";
      console.log(lat);

      //https://jhoyimperial.wordpress.com/2008/07/28/parsing-json-data-from-php-using-jquery/
      $.getJSON("crea_poi_protezionecivile.php?tipo="+tipo+"&lat="+lat+"&lng="+lng+"");

      carica_geojson();

      markerList.push(marker); // aggiunge marker(variabile locale) a markerlist
      return false;
    },

    onMapClickAddMarker: function (e) {
        map.removeEventListener('click');
        document.getElementById('map').style.cursor = 'auto';

        var popupContent =  "You clicked on the map at " + e.latlng.toString();
        var the_popup = L.popup({maxWidth: 160, closeButton: false});
        the_popup.setContent(popupContent);

        var marker = L.marker(e.latlng);
        marker.addTo(map);
        marker.bindPopup(the_popup).openPopup();
        markerList.push(marker);

        return false;
    },

    onMarkerClickDelete: function (e) {
        map.removeLayer(this);
        var marker_index = markerList.indexOf(this);
        delete markerList[marker_index];

        for (var marker = 0; marker < markerList.length; marker++) {
            if (typeof(markerList[marker]) !== 'undefined') {
                markerList[marker].removeEventListener('click', arguments.callee);
            }
        }
        return false;
    }
});

var markerList = [];
