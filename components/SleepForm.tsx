import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SleepSubmission {
  bedTime: string;
  wakeUpTime: string;
}

interface SleepFormProps {
  onSubmit: (data: SleepSubmission) => void;
}

export default function SleepForm({ onSubmit }: SleepFormProps) {
  // Use full Date objects for both timestamps
  const [bedTime, setBedTime] = useState<Date>(new Date());
  const [wakeUpTime, setWakeUpTime] = useState<Date>(new Date(Date.now() + 8 * 60 * 60 * 1000)); // default +8 hours

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert both to ISO strings before sending
    onSubmit({
      bedTime: bedTime.toISOString(),
      wakeUpTime: wakeUpTime.toISOString(),
    });

    // Reset form
    setBedTime(new Date());
    setWakeUpTime(new Date(Date.now() + 8 * 60 * 60 * 1000));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col">
        <span className="mb-1 font-medium">Bed Time:</span>
        <DatePicker
          selected={bedTime}
          onChange={(d: Date | null) => { if (d) setBedTime(d); } }
          showTimeSelect
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          className="border rounded p-2 w-full"
        />
      </label>

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Wake Up Time:</span>
        <DatePicker
          selected={wakeUpTime}
          onChange={(d: Date | null) => { if (d) setWakeUpTime(d); } }
          showTimeSelect
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          className="border rounded p-2 w-full"
        />
      </label>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-colors"
      >
        Submit Sleep
      </button>
    </form>
  );
}
