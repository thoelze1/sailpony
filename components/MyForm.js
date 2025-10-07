// src/MyForm.js
import React, { useState } from "react";
import TimePicker from "react-time-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";

export default function MyForm({ onSubmit }) {
  const [time, setTime] = useState("12:00");
  const [paragraph, setParagraph] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDate = date instanceof Date ? date : new Date(date);
    onSubmit({ time, paragraph, number, date: selectedDate.toISOString() });
    setParagraph("");
    setNumber("");
    setDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Select Date:</span>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          className="border rounded p-2 w-full"
          dateFormat="yyyy-MM-dd"
        />
      </label>
      
      <label className="flex flex-col">
        <span className="mb-1 font-medium">Select Time:</span>
        <TimePicker
          onChange={setTime}
          value={time}
          disableClock={true}
          className="border rounded p-2 w-full"
        />
      </label>

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Enter Paragraph:</span>
        <textarea
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          rows={4}
          className="border rounded p-2 w-full resize-none"
        />
      </label>

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Enter Number:</span>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border rounded p-2 w-full resize-none"
        />
      </label>
      
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
