"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import { useEffect } from "react";
import L from "leaflet";

function GpxTrack({ url }: { url: string }) {
  const map = useMap();

  useEffect(() => {
    const gpx = new L.GPX(url, {
      async: true,
      marker_options: {
        startIconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        endIconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      },
    })
      .on("loaded", (e: { target: L.GPX }) => {
        map.fitBounds(e.target.getBounds());
      })
      .addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [url, map]);

  return null;
}

export default function GpxMapInner({ gpxUrl }: { gpxUrl: string }) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      className="h-[500px] w-full rounded overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <GpxTrack url={gpxUrl} />
    </MapContainer>
  );
}
