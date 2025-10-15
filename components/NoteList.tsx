// src/components/NoteList.tsx
'use client';

import React from 'react';
import type { Note } from '@prisma/client';

interface NoteListProps {
  // Define the prop: an array of Note objects
  notes: Note[]; 
}

/**
 * Helper function to format the ISO string into a human-readable, minimal timestamp.
 * * @param isoString The ISO string (serialized Date) received from the server.
 * @returns A formatted string like "Oct 14, 5:57 PM"
 */
const formatTimestamp = (isoString: string): string => {
  // Convert the ISO string back into a Date object for locale formatting
  const date = new Date(isoString);
  
  // Format as: "Oct 14, 5:57 PM"
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};

export default function NoteList({ notes }: NoteListProps) {
  return (
    <div className="flex flex-col">
      {/* Table Header: Removed the outer border-bottom, will be provided by the parent section */}
      <div className="grid grid-cols-12 text-sm font-semibold text-teal-400 py-2 px-3 bg-gray-700">
        {/* Narrow column for time/date */}
        <div className="col-span-4 lg:col-span-3">Time & Date</div>
        {/* Wide column for content */}
        <div className="col-span-8 lg:col-span-9">Log Entry Content</div>
      </div>

      {/* Log Entries List */}
      <div>
        {notes.map((note, index) => (
          <div 
            key={note.id} 
            // Apply alternating row colors and rounded corners to the last item
            className={`
              grid grid-cols-12 items-start py-3 px-3 transition duration-150 
              ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'} 
              ${index === notes.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-700'}
            `}
          >
            {/* Narrow Timestamp Column */}
            <div className="col-span-4 lg:col-span-3 text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap pt-1">
              {formatTimestamp(note.createdAt)}
            </div>

            {/* Wide Content Column */}
            <div className="col-span-8 lg:col-span-9 text-sm md:text-base text-gray-200">
              {note.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}