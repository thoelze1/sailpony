// src/app/page.js (Server Component)
export const dynamic = "force-dynamic"; // otherwise notes don't update

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
  return notes;
  /*
  return notes.map(note => ({
    ...note,
      createdAt: note.createdAt.toISOString(),
      }));
   */
}
export default async function HomePage() {
  const initialNotes = await getNotes()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 space-y-8 text-white">
      <CrewNoteForm />
      <NoteList notes={initialNotes} /> 
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