// src/ChartView.js
'use client';

import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Tooltip, Popup, useMap } from "react-leaflet"
import * as L from "leaflet";
import gpxParser from 'gpxparser';

interface TrackPoint {
  latlng: L.LatLng;
  time: number;
}

interface GpxTrackProps {
  url: string;
  onPointsLoaded: (points: TrackPoint[]) => void;
}

interface Photo {
  url: string;
  timestamp: Date;
  lat?: number;
  lng?: number; // optional if you have GPS
}

const photos: Photo[] = [
  {
    url: '/photos/PXL_20251001_232545626.jpg',
    timestamp: new Date("2025-10-01T19:25:45.000Z")
  },
  {
    url: '/photos/PXL_20251002_000312003.jpg',
    timestamp: new Date("2025-10-01T20:03:12.000Z")
  },
  {
    url: '/photos/PXL_20251002_000312472.jpg',
    timestamp: new Date("2025-10-01T20:03:12.000Z")
  },
  {
    url: '/photos/PXL_20251002_000313174.jpg',
    timestamp: new Date("2025-10-01T20:03:13.000Z")
  },
]

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
    if (typeof window === "undefined") return;
    
    import('leaflet-gpx').then(() => {
      if (!L.GPX) {
        console.error("L.GPX is not defined after importing 'leaflet-gpx'");
        return;
      }
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
    });
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
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [currentPoint, setCurrentPoint] = useState<TrackPoint | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const start = trackPoints.length > 0 ? trackPoints[0].time : 0;
  const end = trackPoints.length > 0 ? trackPoints[trackPoints.length - 1].time : 0;

  //  const start = new Date("2025-09-30T00:00:00Z").getTime();
  //const end = new Date("2025-10-01T23:00:00Z").getTime();
  useEffect(() => {
    const trackPointsWithTime : TrackPoint[] =[];
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
              latlng: new L.LatLng(point.lat, point.lon),
              time: point.time.getTime() // Time is available here
            });
          });
        });
        console.log("trackPointsWithTime length: ", trackPointsWithTime.length);
        setTrackPoints(trackPointsWithTime);
      })
      .catch(error => console.error("Error fetching or parsing GPX file:", error));
  }, []);

  useEffect(() => {
    if (selectedTime === null || trackPoints.length === 0) return;
    
    // find the closest point in time
    const closest = trackPoints.reduce((prev, curr) => {
      return Math.abs(curr.time - selectedTime!) < Math.abs(prev.time - selectedTime!)
        ? curr
        : prev;
    });
    
    setCurrentPoint(closest);
    }, [selectedTime, trackPoints]);

  const nearbyPhotos: Photo[] = photos.filter(photo => {
    if (!selectedTime) return false;
    const delta = Math.abs(photo.timestamp.getTime() - selectedTime);
    return delta <= 5 * 60 * 1000; // ±5 minutes
  });
  
  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="w-full flex flex-col items-center space-y-2 mb-4">
        {/* 🕒 Current Time Label */}
        <p className="text-sm text-gray-300 font-medium mb-2">
          {selectedTime
            ? new Date(selectedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : "Select a time"}
        </p>
        
        {/* 🎚 Slider */}
        <input
          type="range"
          min={start}
          max={end}
          step={1000} // 1 second increments
          value={selectedTime ?? start}
          onChange={(e) => setSelectedTime(Number(e.target.value))}
          className="w-full accent-blue-500 bg-gray-700 rounded-lg cursor-pointer"
        />
      </div>
      <div className="flex w-full gap-4 h-full">
        <div className="w-1/3 h-[1200px] rounded-xl overflow-hidden shadow-lg">
          <MapContainer style={{ height: '100%', width: "100%" }} center={[41.2195553, -73.9674118]} zoom={15} scrollWheelZoom={true}>
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
            {trackPoints.length > 0 && currentPoint != null && (
              <Marker
                position={currentPoint.latlng}
                icon={customIcon}
                //ref={markerRef}
              />
            )}
          </MapContainer>
        </div>
        <div className="w-2/3 flex flex-col gap-2">
           {nearbyPhotos.length === 0 ? (
            <p className="text-gray-400">No photos at this time</p>
          ) : (
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[600px] p-2 rounded-xl bg-gray-800 shadow-inner">
              {nearbyPhotos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo.url}
                  alt={`Photo ${idx}`}
                  className="h-40 rounded-lg shadow-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
