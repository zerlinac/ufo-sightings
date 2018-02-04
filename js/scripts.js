var map = L.map('mapContainer').setView([40.1,-100.3], 4);

//instantiate map
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

$.getJSON('js/us-states.js', function(jqueryData) {
  L.geoJson(statesData).addTo(map);
});


// control that shows state info on hover
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>Number of UFO Sightings 1960 - 2014</h4>' +  (props ?
      '<h5>' + props.name + '<br />' + props.sightings + ' sightings'
      : '<h5>Hover over a state</h5>');
  };

  info.addTo(map);


  function getColor(d) { // get color depending on count
    return d > 2000 ? '#006d2c' :
        d > 1000  ? '#31a354' :
        d > 500  ? '#74c476' :
        d > 100   ? '#c7e9c0' :
              '#edf8e9';
  }

  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.sightings)
    };
  }

  function highlightFeature(e) { //highlights borders in yellow, updates sightings info
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'yellow',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson; //adds interactivity

  function resetHighlight(e) { //returns to default style on mouseout
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) { //add listeners to layer
    layer.bindPopup(feature.properties.name + "<br><a href='http://www.nuforc.org/webreports/" + feature.properties.path + ".html'>Click to see all reports of UFO sightings</a>");
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);


$('li.nav').click(function() { //adds click functionality to sidebar
  var c = $(this).attr('id'),
    menu_tabs = $('.tabs');

  $('li.nav').removeClass('active');         
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
    } 

    $.each(menu_tabs, function(i, el) {
      var $el = $(el);

    $el.removeClass('active');

    if ($el.attr('class') === "menu tabs " + c) {
      $(this).addClass('active');
    } 
  });
});


//checks screen width and sets active content from menu tabs
function checkScreenWidth() {
  if (w.innerWidth <= 350 ) {

    $('#about').removeClass('active');
    $('.tabs.about').removeClass('active');

  } else {

    $('#metadata').addClass('active');
    $('.tabs.metadata').addClass('active');
  }
}
           

//legend
var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 100, 500, 1000, 2000],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) { //creates legend values
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);