const lat = 38.91473296688135;
const lon = -75.42635549832752;

// Function to load GeoJSON data from a file and add it to the map
// I used AI for this lol so there is probably a better way
var filePath = "map.geojson";

function addGeoJSONLayerToMap(filePath) {
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      var geoJSONLayer = L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "<h3>" +
              feature.properties.name +
              "</h3><p>" +
              feature.properties.description +
              "</p>"
          );
        },
      }).addTo(map);
    })
    .catch((error) => {
      console.error("Error loading GeoJSON data:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var map = L.map("map", {
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
  addGeoJSONLayerToMap(filePath);
});
