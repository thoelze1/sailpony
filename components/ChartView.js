// src/ChartView.js
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ChartView({ data }) {
  const chartData = data.map((item) => ({
    date: new Date(item.date),
    number: Number(item.number),
  })).sort((a, b) => a.date - b.date) // sort ascending
        .map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString(), // format after sorting
        }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10 w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Number Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="number" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
