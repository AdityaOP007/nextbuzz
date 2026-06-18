"use client";

import { useEffect, useRef } from "react";

interface EventMapProps {
  latitude: number;
  longitude: number;
  venue: string;
}

export default function EventMap({ latitude, longitude, venue }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([latitude, longitude], 14);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      const eventIcon = L.divIcon({
        html: '<div style="background:#FF6B35;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)">📍</div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([latitude, longitude], { icon: eventIcon })
        .addTo(map)
        .bindPopup(`<strong>${venue}</strong>`);

      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            if (cancelled) return;

            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;

            const userIcon = L.divIcon({
              html: '<div style="background:#00C9A7;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)">🧭</div>',
              className: "",
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });

            L.marker([userLat, userLng], { icon: userIcon })
              .addTo(map)
              .bindPopup("Your location");

            const routingModule = await import("leaflet-routing-machine") as {
              default?: { control: (opts: Record<string, unknown>) => { addTo: (m: typeof map) => void } };
              control?: (opts: Record<string, unknown>) => { addTo: (m: typeof map) => void };
            };
            const controlFn =
              routingModule.default?.control ?? routingModule.control;
            if (controlFn) {
              controlFn({
                waypoints: [L.latLng(userLat, userLng), L.latLng(latitude, longitude)],
                routeWhileDragging: false,
                show: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                lineOptions: {
                  styles: [{ color: "#FF6B35", weight: 5, opacity: 0.8 }],
                },
              }).addTo(map);
            }
          },
          () => {
            // geolocation denied — map shows event only
          }
        );
      }
    }

    initMap().catch(console.error);

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [latitude, longitude, venue]);

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full overflow-hidden rounded-[14px] border border-[var(--border)]"
    />
  );
}
