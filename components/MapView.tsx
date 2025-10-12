// src/ChartView.js
'use client';

import React from "react";
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Tooltip, Popup } from "react-leaflet"
import * as L from "leaflet";
import "leaflet-gpx";

//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/*
function GpxTrack({ url }: { url: string }) {
  // Custom hook to add GPX to the map
  const MapComponent = (await import("react-leaflet")).useMap();
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
      .on("loaded", (e: any) => {
        MapComponent.fitBounds(e.target.getBounds());
      })
      .addTo(MapComponent);
  }, [url, MapComponent]);

  return null;
}
 */
export default function MapView() {
  const customIcon = new L.Icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
  });
  const gpxUrl = "/day1.gpx";
  return (
    <MapContainer style={{ height: '100vh' }} center={[41.2195553, -73.9674118]} zoom={15} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={[41.2195553, -73.9674118]} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer> );
}
