// src/CalendarView.js
import React from "react";
import { format, addDays, startOfDay } from "date-fns";

export default function CalendarView({ startDate = new Date(), numberOfDays = 3 }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: numberOfDays }, (_, i) =>
    addDays(startOfDay(startDate), i)
  );

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
        {/* Column headers (dates) */}
        <div></div>
        {days.map((day, idx) => (
          <div key={idx} className="text-center font-semibold border-b pb-2">
            {format(day, "EEE, MMM d")}
          </div>
        ))}

        {/* Hour rows */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour label */}
            <div className="text-right pr-2 text-gray-500 text-sm border-r">
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>

            {/* Day columns */}
            {days.map((day, idx) => (
              <div
                key={`${day}-${hour}`}
                className={`border-b border-gray-200 h-16 relative border-r`}
              >
                {/* Later we can position events here */}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
