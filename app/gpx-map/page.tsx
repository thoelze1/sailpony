"use client";

import dynamic from "next/dynamic";

// This dynamically imports the Leaflet map *only in the browser*
const GpxMap = dynamic(() => import("./GpxMapInner"), { ssr: false });

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Here we were on day 3:</h1>
      <GpxMap gpxUrl="/day1.gpx" />
    </main>
  );
}
