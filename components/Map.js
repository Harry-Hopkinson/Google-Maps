function geocode(platform) {
  var geocoder = platform.getSearchService(),
    geocodingParameters = {
      q: ''
    };
  
  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}

function onSuccess(result) {
  var locations = result.items;
  addLocationsToMap(locations);
  addLocationsToPanel(locations);
}

function onError(error) {
  alert('Can\'t reach the remote server');
}
  
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();
  
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:37.376, lng:-122.034},
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1
});
window.addEventListener('resize', () => map.getViewPort().resize());
  
var locationsContainer = document.getElementById('panel');
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);
var bubble;

function openBubble(position, text){
  if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function addLocationsToPanel(locations){
  
  var nodeOL = document.createElement('ul'),
      i;
  
  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  
  
    for (i = 0;  i < locations.length; i += 1) {
      let location = locations[i];
      var li = document.createElement('li'),
          divLabel = document.createElement('div'),
          address = location.address,
          content =  '<strong style="font-size: large;">' + address.label  + '</strong></br>';
          position = location.position;
  
      content += '<strong>houseNumber:</strong> ' + address.houseNumber + '<br/>';
      content += '<strong>street:</strong> '  + address.street + '<br/>';
      content += '<strong>district:</strong> '  + address.district + '<br/>';
      content += '<strong>city:</strong> ' + address.city + '<br/>';
      content += '<strong>postalCode:</strong> ' + address.postalCode + '<br/>';
      content += '<strong>county:</strong> ' + address.county + '<br/>';
      content += '<strong>country:</strong> ' + address.countryName + '<br/>';
      content += '<strong>position:</strong> ' +
        Math.abs(position.lat.toFixed(4)) + ((position.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(position.lng.toFixed(4)) + ((position.lng > 0) ? 'E' : 'W') + '<br/>';
  
      divLabel.innerHTML = content;
      li.appendChild(divLabel);
  
      nodeOL.appendChild(li);
  }
  locationsContainer.appendChild(nodeOL);
}
  
function addLocationsToMap(locations){
  var group = new  H.map.Group(),
      position,
      i;

  // Add a marker for each location found
  for (i = 0;  i < locations.length; i += 1) {
    let location = locations[i];
    marker = new H.map.Marker(location.position);
    marker.label = location.address.label;
    group.addObject(marker);
  }
  
  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
        evt.target.getGeometry(), evt.target.label);
  }, false);
  
  // Add the locations group to the map
  map.addObject(group);
  map.setCenter(group.getBoundingBox().getCenter());
}

geocode(platform); 