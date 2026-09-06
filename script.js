const map = L.map("map").setView([40.72, -73.95], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let pathLayer;
let lirrLayer;

Promise.all([
  fetch("./data/path-routes.geojson").then((response) => {
    if (!response.ok) {
      throw new Error("Could not load PATH route data");
    }
    return response.json();
  }),

  fetch("./data/lirr-routes.geojson").then((response) => {
    if (!response.ok) {
      throw new Error("Could not load LIRR route data");
    }
    return response.json();
  })
])
  .then(([pathData, lirrData]) => {
    pathLayer = L.geoJSON(pathData, {
      style: {
        color: "#e63946",
        weight: 6,
        opacity: 0.9
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);

    lirrLayer = L.geoJSON(lirrData, {
      style: {
        color: "#2563eb",
        weight: 6,
        opacity: 0.9
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties.name);
      }
    }).addTo(map);

    L.control.layers(
      null,
      {
        "PATH routes": pathLayer,
        "LIRR routes": lirrLayer
      },
      {
        collapsed: false
      }
    ).addTo(map);

    const allRoutes = L.featureGroup([pathLayer, lirrLayer]);
    map.fitBounds(allRoutes.getBounds().pad(0.1));
  })
  .catch((error) => {
    console.error(error);
    alert("The route data could not be loaded. Check the browser console.");
  });
