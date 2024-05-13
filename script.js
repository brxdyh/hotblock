// Function to load GeoJSON data from a file and add it to the map
// I used AI for this lol so there is probably a better way
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
  var map = L.map("map").setView([38.91473296688135, -75.42635549832752], 17); // Sets initial coordinates (Arena's) and zoom level

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);
  var filePath = "map.geojson";
  addGeoJSONLayerToMap(filePath);
});
