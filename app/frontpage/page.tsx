// src/app/page.js (Server Component)

import { prisma } from '@/lib/prisma'
import CrewNoteForm from '@/components/CrewNoteForm' // Client Component
import NoteList from '@/components/NoteList' // Client Component to handle hydration

/*
// Server function to get data
async function getNotes() {
  return prisma.note.findMany({
    orderBy: { createdAt: 'desc' }, 
  })
  }
 */

async function getNotes() {
  // Prisma is queried directly from the Server Component
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' }, // Newest at the top
    // Note: Prisma returns Date objects for createdAt/updatedAt
  });
  return notes.map(note => ({
    ...note,
      createdAt: note.createdAt.toISOString(),
  }));
}
export default async function HomePage() {
  const initialNotes = await getNotes()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 space-y-8 text-white">
      {/* ... Log Submission Form (Keep this as a separate card) ... */}

      {/* --- START: Log History Card (The Split Card) --- */}
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        
        {/* TOP SECTION: Header Area (Different Background Color) */}
        <div className="bg-gray-700 p-4 border-b border-teal-600/50">
          <h2 className="text-2xl font-semibold text-teal-300">Log History</h2>
        </div>
        
        {/* BOTTOM SECTION: Content/List Area (Main Background Color) */}
        <div className="bg-gray-800">
          {/* NoteList now renders the actual data rows */}
          <NoteList notes={initialNotes} /> 
        </div>
      </div>
      {/* --- END: Log History Card --- */}
    </div>
    
  )
}

// <main>
//       <h1>Ship's Log</h1>

//       {/* The form is a client component */}
//       <CrewNoteForm 
//         // We don't pass a function here, instead, we rely on 
//         // Next.js to revalidate the cache after a successful POST.
//       />

//       <hr />

//       <h2>Recent Entries</h2>
//       {/* This is one way to pass initial data from a Server Component 
//         to a Client Component for display.
//       */}
//       <NoteList notes={initialNotes} /> 
//     </main>