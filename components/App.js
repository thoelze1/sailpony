"use client";

import React, { useMemo, useState, useEffect } from "react";
import MyForm from "./MyForm";
import ChartView from "./ChartView";
import CalendarView from "./CalendarView";
import SleepForm from "./SleepForm";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";

export default function App() {
  const [submissions, setSubmissions] = useState([]);
  const [sleepData, setSleepData] = useState([]);

  const Map = dynamic(
    () => import('./MapView'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  );
  
  // Load existing submissions from backend
  useEffect(() => {
    fetch("/api/submission")
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error("Failed to load submissions:", err));
  }, []);

  useEffect(() => {
    fetch("/api/sleep")
      .then(res => res.json())
      .then(data => setSleepData(data))
      .catch(err => console.error("Failed to load sleep data", err));
  }, []);

  // handler to submit new sleep record
  const handleNewSleep = async (sleepRecord) => {
    try {
      const res = await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sleepRecord),
      });
      if (!res.ok) throw new Error("Failed to save sleep record");
      const saved = await res.json();
      setSleepData([saved, ...sleepData]);
    } catch (err) {
      console.error(err);
    }
  };
  const handleNewSubmission = async (submission) => {
    try {
      const res = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      setSubmissions([saved, ...submissions]);
    } catch (err) {
      console.error("Failed to save submission:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      const res = await fetch(`/api/submission/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete submission:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 space-y-8 text-white">
      {/* Map container card */}
      <div className="h-[600px] w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg bg-gray-800 border border-gray-700">
        <p className="p-4 text-lg font-medium">{"We're sailing from Lake Champain to the Florida keys on a 42 foot sailboat. On October 1, we encountered some heavy fog coming through the lowermost locks on the Champlain Canal. Use the slider below to see our progress and to see what photos we took along the way. I'll add more when Bailey, Clay & I put our photos together."}
        </p>
        <Map />
      </div>
    </div>
  );
}
