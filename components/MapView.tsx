// src/ChartView.js
'use client';

import { React, useEffect } from "react";
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Tooltip, Popup, useMap } from "react-leaflet"
import * as L from "leaflet";
import "leaflet-gpx";

//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
function GpxTrack({ url }: { url: string }) {
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
  const map = useMap();

  useEffect(() => {
    const gpx = new L.GPX(url, {
      async: true,
      markers: {
        startIcon: customIcon,
        endIcon: customIcon,
        // shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
    <MapContainer style={{ height: '100vh' }} center={[41.2195553, -73.9674118]} zoom={15} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GpxTrack url={gpxUrl} />    
      <Marker position={[41.2195553, -73.9674118]} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer> );
}
