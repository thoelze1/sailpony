// src/ChartView.js
'use client';

import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css"
import { Polyline, MapContainer, Marker, TileLayer, Tooltip, Popup, useMap } from "react-leaflet"
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
  /*
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

  // Inside your GpxTrack component...

  useEffect(() => {
    // 1. Ensure we are in the browser and the map is ready
    if (typeof window === "undefined" || !map) return;
    const windowWithL = window as WindowWithL;
    // Use an IIFE (Immediately Invoked Function Expression) for async cleanup
    const loadGpxPlugin = async () => {
      try {
        // Dynamically import the plugin
        const gpxModule = (await import('leaflet-gpx')) as unknown as GpxModule;

        // 🚨 CRITICAL: Determine the correct GPX Constructor
        // Check the module's default export OR the global L object (where the plugin attaches itself)
        const GPXConstructor = 
              gpxModule.GPX || 
                windowWithL.L?.GPX;

        if (!GPXConstructor) {
          console.error("L.GPX could not be found after dynamic import. The plugin failed to register.");
          return;
        }

        // 2. Use the successfully resolved constructor
        const gpx = new GPXConstructor(url, {
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

        // 3. Return the cleanup function
        return () => {
          map.removeLayer(gpx);
        };

      } catch (error) {
        console.error("Error loading leaflet-gpx:", error);
      }
    };
    
    // Call the async loader function
    const cleanup = loadGpxPlugin();

    // The returned cleanup function will be a Promise, which React handles fine
    return () => {
      cleanup.then(fn => fn && fn());
    };

  }, [url, map, customIcon]); // Added customIcon dependency for correctness
  /*
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
   */

type LatLngTuple = [number, number];
function CustomGpxTrack({ url }: GpxTrackProps) {
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

  const [trackPoints, setTrackPoints] = useState<LatLngTuple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndParseGpx = async () => {
      setLoading(true);
      try {
        // 1. Fetch the GPX file content
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch GPX file: ${response.statusText}`);
        }
        const gpxText = await response.text();

        // 2. Parse the GPX content
        const parser = new gpxParser();
        parser.parse(gpxText);
                
        // 3. Extract coordinates (lat, lon) from all tracks/segments
        const points: LatLngTuple[] = [];
        parser.tracks.forEach(track => {
          track.points.forEach(p => {
            // Leaflet uses [lat, lon] order
            points.push([p.lat, p.lon]); 
          });
        });

        if (points.length > 0) {
          setTrackPoints(points);

          // 4. Fit map bounds (equivalent to leaflet-gpx's .on('loaded', ...))
          const latLngs = points.map(p => L.latLng(p[0], p[1]));
          map.fitBounds(L.latLngBounds(latLngs));
        } else {
          setTrackPoints([]);
        }

      } catch (error) {
        console.error("Error processing GPX data:", error);
        setTrackPoints([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch and parse if the URL is valid
    if (url) {
      fetchAndParseGpx();
    }

  }, [url, map]); // Re-run effect if URL changes or map instance changes

  // Optional: Render a loading indicator or null while processing
  if (loading && trackPoints.length === 0) {
    return null; 
  }

  return (
    <>
      {/* 5. Draw the Polyline */}
      {trackPoints.length > 0 && (
        <Polyline 
          positions={trackPoints} 
          pathOptions={{ 
            color: 'red', 
            weight: 5, 
            opacity: 0.8 
          }} 
        />
      )}
            
      {/* Optional: Render Start/End Markers */}
      {trackPoints.length > 0 && (
        <>
          {/* Start Marker */}
          <Marker position={trackPoints[0]} icon={customIcon} />
          {/* End Marker */}
          <Marker position={trackPoints[trackPoints.length - 1]} icon={customIcon} />
        </>
      )}
    </>
  );
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
            <TileLayer
              attribution='NOAA Nautical Charts &copy; <a href="https://www.nauticalcharts.noaa.gov/">NOAA</a>'
              // This is a common publicly available URL for NOAA's RNC (Raster Nautical Chart) tiles.
              url="https://tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png"
              // NOAA charts typically only support zoom levels up to z18
              maxZoom={18}
            />
            <TileLayer
              attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a>'
              url="http://tiles.openseamap.org/seamap/{z}/{x}/{y}.png"
              zIndex={500} // Ensure it draws above the base map
            />
            <CustomGpxTrack url={gpxUrl} onPointsLoaded={(() => {})}/>    
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
