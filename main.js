const lat = 38.91473296688135; // Uses Arena's in Milford as a placeholder
const lon = -75.42635549832752;
const map = L.map("map", {
  renderer: L.canvas({ tolerance: 10 }),
}).setView([lat, lon], 17); // Sets initial coordinates and zoom level

// Sets maximum usable boundaries of the map
map.setMaxBounds([
  [73.5107240340998, -175.02086457138665],
  [-48.995311187950925, 175.02086457138665],
]);

// Initializes the map UI (zoom controls, lower right info)
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

  // Handle form submissions to add new locations to map
  $("#location-form").submit(function (e) {
    e.preventDefault();

    // Grabs form values
    var locationName = $("#location-name").val();
    var cords = $("#location-cords").val().split(",");

    // Checks and ensures both location and names are provided
    if (locationName && cords.length === 2) {
      var lat = parseFloat(cords[0].trim());
      var lon = parseFloat(cords[1].trim());

      if (!isNaN(lat) && !isNaN(lon)) {
        // Adds new marker to map
        var newMarker = L.marker([lat, lon]).addTo(map);
        newMarker.bindPopup(locationName).openPopup();

        // Optionally: Send the new data to the server using AJAX
        $.ajax({
          type: "POST",
          url: "/add_marker",
          contentType: "application/json",
          data: JSON.stringify({
            name: locationName,
            coordinates: [lat, lon],
            lastSeen: new Date().toISOString(),
          }),
          success: function (response) {
            console.log("Marker added successfully:", response);
          },
          error: function (err) {
            console.error("Error adding marker:", err);
          },
        });
      } else {
        alert("Invalid coordinates. Please use format: lat, lon.");
      }
    } else {
      alert("Please provide both a location name and coordinates.");
    }
  });
});
