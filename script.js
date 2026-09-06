const map = L.map("map").setView([40.72, -73.95], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Simplified PATH route examples
const pathRoutes = [
  {
    name: "PATH: World Trade Center to Newark",
    coordinates: [
      [40.7127, -74.0134],
      [40.7347, -74.0294],
      [40.7505, -74.0334],
      [40.7357, -74.1724]
    ]
  },
  {
    name: "PATH: Journal Square to 33rd Street",
    coordinates: [
      [40.7334, -74.0625],
      [40.7427, -74.0507],
      [40.7484, -74.0323],
      [40.7505, -74.0014]
    ]
  }
];

// Simplified LIRR route examples
const lirrRoutes = [
  {
    name: "LIRR: Atlantic Terminal to Jamaica",
    coordinates: [
      [40.6837, -73.9772],
      [40.6869, -73.9576],
      [40.6998, -73.9197],
      [40.7003, -73.8088]
    ]
  },
  {
    name: "LIRR: Jamaica to Ronkonkoma",
    coordinates: [
      [40.7003, -73.8088],
      [40.7338, -73.7613],
      [40.7462, -73.6227],
      [40.8088, -73.1123]
    ]
  },
  {
    name: "LIRR: Jamaica to Long Beach",
    coordinates: [
      [40.7003, -73.8088],
      [40.6651, -73.7296],
      [40.5889, -73.6654]
    ]
  }
];

function createRouteLayer(routes, color) {
  const layer = L.layerGroup();

  routes.forEach((route) => {
    const line = L.polyline(route.coordinates, {
      color: color,
      weight: 6,
      opacity: 0.9
    });

    line.bindPopup(`<strong>${route.name}</strong>`);
    line.addTo(layer);
  });

  return layer;
}

const pathLayer = createRouteLayer(pathRoutes, "#e63946");
const lirrLayer = createRouteLayer(lirrRoutes, "#2563eb");

pathLayer.addTo(map);
lirrLayer.addTo(map);

// Important stations
const stations = [
  {
    name: "World Trade Center PATH",
    position: [40.7127, -74.0134],
    system: "PATH"
  },
  {
    name: "Newark Penn Station",
    position: [40.7357, -74.1724],
    system: "PATH"
  },
  {
    name: "Jamaica Station",
    position: [40.7003, -73.8088],
    system: "LIRR"
  },
  {
    name: "Atlantic Terminal",
    position: [40.6837, -73.9772],
    system: "LIRR"
  }
];

stations.forEach((station) => {
  const marker = L.circleMarker(station.position, {
    radius: 7,
    color: "#111827",
    weight: 2,
    fillColor: "white",
    fillOpacity: 1
  });

  marker.bindPopup(
    `<strong>${station.name}</strong><br>${station.system}`
  );

  marker.addTo(map);
});

// Layer controls
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

// Fit the map around all route lines
const allRoutes = L.featureGroup([pathLayer, lirrLayer]);
map.fitBounds(allRoutes.getBounds().pad(0.1));
