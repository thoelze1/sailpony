// src/ChartView.js
//'use client';

import React from "react";
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Tooltip, Popup } from "react-leaflet"
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MapView() {
  return (
    <MapContainer style={{ height: '100vh' }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.498, -0.11]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer> );
}
