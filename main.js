const lat = 38.91473296688135;
const lon = -75.42635549832752;
const map = L.map("map", {
  renderer: L.canvas({ tolerance: 10 }),
}).setView([lat, lon], 17); // Sets initial coordinates (Arena's) and zoom level

map.setMaxBounds([
  [73.5107240340998, -175.02086457138665],
  [-48.995311187950925, 175.02086457138665],
]);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  zoomControl: false,
  minZoom: 3,
  noWrap: true,
}).addTo(map);

document.addEventListener("DOMContentLoaded", function () {
  $.ajax({
    type: "GET",
    url: "map.geojson",
    dataType: "json",
    success: function (data) {
      // Create a Leaflet layer group to hold the markers
      var policeLayer = L.layerGroup().addTo(map);

      // Loop through the GeoJSON features and add markers to the layer group
      data.features.forEach(function (feature) {
        var marker = L.marker(feature.geometry.coordinates).addTo(policeLayer);
        var lastSeen = new Date(feature.properties.lastSeen);
        var userTimezoneOffset = new Date().getTimezoneOffset() * 60000; // Get user's timezone offset in milliseconds
        var adjustedLastSeen = new Date(
          lastSeen.getTime() + userTimezoneOffset
        ); // Adjust the date and time to EST
        var formattedLastSeen = adjustedLastSeen.toLocaleString();
        var popupContent =
          feature.properties.name + "<br>Last seen: " + formattedLastSeen;
        marker.bindPopup(popupContent);
      });
    },
  });
});
