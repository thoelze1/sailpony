// src/app/page.js (Server Component)
export const dynamic = "force-dynamic"; // otherwise notes don't update

import { prisma } from '@/lib/prisma'
import CrewNoteForm from '@/components/CrewNoteForm' // Client Component
import NoteList from '@/components/NoteList' // Client Component to handle hydration

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
    <div className="min-h-screen flex flex-col items-center p-6 space-y-8 text-white">
      <NoteList notes={initialNotes} /> 
    </div>
  )
}