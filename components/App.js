"use client";

import React, { useState, useEffect } from "react";
import MyForm from "./MyForm";
import ChartView from "./ChartView";
import CalendarView from "./CalendarView";
import SleepForm from "./SleepForm";

export default function App() {
  const [submissions, setSubmissions] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  
  // Load existing submissions from backend
  useEffect(() => {
    fetch("/api/submissions")
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
      const res = await fetch("/api/submissions", {
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
      const res = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete submission:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6 space-y-8">
      
      {/* Form Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Submit Data</h1>
        <MyForm onSubmit={handleNewSubmission} />
      </div>

      {/* Submissions Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-center">Submissions</h2>
        <ul className="flex flex-col gap-4">
          {submissions.length === 0 && (
            <p className="text-gray-400 text-center">No submissions yet.</p>
          )}
          {submissions.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow-sm bg-gray-50 flex flex-col">
              <p><span className="font-semibold">Date:</span> {new Date(item.date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Time:</span> {item.time}</p>
              <p><span className="font-semibold">Paragraph:</span> {item.paragraph}</p>
              <p><span className="font-semibold">Number:</span> {item.number}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-2 self-start bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chart Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <ChartView data={submissions} />
      </div>

      {/* Calendar Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-5xl">
        <CalendarView numberOfDays={3} />
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-center">Sleep Form</h2>
        <SleepForm onSubmit={handleNewSleep} />
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-center">Sleep Submissions</h2>
        {sleepData.length === 0 ? (
          <p className="text-gray-400 text-center">No sleep data yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {sleepData.map((item) => (
              <li key={item.id} className="border p-4 rounded shadow-sm bg-gray-50 flex flex-col">
                <p><span className="font-semibold">Bed Time:</span> {item.bedTime}</p>
                <p><span className="font-semibold">Wake Up Time:</span> {item.wakeUpTime}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
