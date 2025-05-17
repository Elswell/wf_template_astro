import { useEffect } from "preact/hooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

interface UseLeafletMapProps {
  containerRef: preact.RefObject<HTMLElement>;
  lat: number;
  lng: number;
  pinUrl: string;
  zoom?: number;
}

export function useLeafletMap({
  containerRef,
  lat,
  lng,
  pinUrl,
  zoom = 14,
}: UseLeafletMapProps) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: [lat, lng],
      zoom,
      gestureHandling: true,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const icon = L.icon({
      iconUrl: pinUrl,
      iconSize: [100, 100],
      iconAnchor: [50, 100],
    });

    L.marker([lat, lng], { icon }).addTo(map).openPopup();

    return () => {
      map.remove();
    };
  }, [containerRef, lat, lng, pinUrl, zoom]);
}
