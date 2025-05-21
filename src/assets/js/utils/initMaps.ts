import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

export function initMapMany({
  container,
  pins,
  mainPinUrl,
  defaultPinUrl,
  defaultZoom = 14,
  zoomControlPosition = "bottomright",
}) {
  if (!container || !pins.length) return;

  const mainPin = pins.find((p) => p.isMain) || pins[0];

  const map = L.map(container, {
    center: [mainPin.lat, mainPin.lng],
    zoom: defaultZoom,
    gestureHandling: true,
    zoomControl: false,
  });

  L.control.zoom({ position: zoomControlPosition }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  pins.forEach((pin) => {
    const icon = L.icon({
      iconUrl: pin.isMain ? mainPinUrl : defaultPinUrl,
      iconSize: pin.isMain ? [40, 40] : [30, 30],
      iconAnchor: pin.isMain ? [20, 40] : [15, 30],
    });

    const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

    if (pin.title || pin.subtitle) {
      marker.bindPopup(`
        <strong>${pin.title ?? ""}</strong>
        <span>${pin.subtitle ?? ""}</span>
      `);
    }

    if (pin.isMain) {
      marker.openPopup();
    }
  });
}
