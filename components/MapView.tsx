// src/ChartView.js
'use client';

import { React, useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Tooltip, Popup, useMap } from "react-leaflet"
import * as L from "leaflet";
import "leaflet-gpx";
import gpxParser from 'gpxparser';

interface TrackPoint {
  latlng: L.LatLng;
  time: number;
}

interface GpxTrackProps {
  url: string;
  onPointsLoaded: (points: TrackPoint[]) => void;
}

function GpxTrack({ url, onPointsLoaded }: GpxTrackProps) {
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
    var trackPointsWithTime = [];
    const gpx = new L.GPX(url, {
      async: true,
      markers: {
        startIcon: customIcon,
        endIcon: customIcon,
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
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [sliderValue, setSliderValue] = useState(0);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const trackPointsWithTime = [];
    const parser = new gpxParser();
    fetch(gpxUrl)
      .then(response => response.text())
      .then(gpxData => {
        // Use gpx-parser to get all points with time
        parser.parse(gpxData);
        console.log("tracks: ", parser.tracks.length);
        parser.tracks.forEach(track => {
          console.log("points: ", track.points.length);
          track.points.forEach(point => {
            //console.log("hi");
            trackPointsWithTime.push({
              latlng: [point.lat, point.lon],
              time: point.time // Time is available here
            });
          });
        });
        console.log("trackPointsWithTime length: ", trackPointsWithTime.length);
        setTrackPoints(trackPointsWithTime);
      })
      .catch(error => console.error("Error fetching or parsing GPX file:", error));
  }, []);

  /*
  useEffect(() => {
    if (!markerRef.current || trackPoints.length === 0) return;
    
    // find the closest point in time
    const closest = trackPoints.reduce((prev, curr) => {
      return Math.abs(curr.time - sliderValue) < Math.abs(prev.time - sliderValue)
        ? curr
        : prev;
    });
    
    markerRef.current.setLatLng(closest.latlng);
  }, [sliderValue, trackPoints]);
   */
  return (
    <div>
      <p>length: {trackPoints.length}</p>
            {trackPoints.length > 0 && (
        <input
          type="range"
          min={0}
          max={trackPoints.length}
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full max-w-4xl h-2 rounded-lg bg-gray-700 accent-blue-500 mt-2"
        />
      )}

      <MapContainer style={{ height: '100vh' }} center={[41.2195553, -73.9674118]} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GpxTrack url={gpxUrl} onPointsLoaded={(points) => {setTrackPoints(points); setSliderValue(points[0]?.time || 0); console.log("points.length: ", points.length); }} />    
        <Marker position={[41.2195553, -73.9674118]} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {trackPoints.length > 0 && (
          <Marker
            position={trackPoints[sliderValue].latlng}
            icon={customIcon}
            ref={markerRef}
          />
        )}
      </MapContainer>
    </div>
  );
}
