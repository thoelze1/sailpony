// src/app/page.js (Server Component)
import CrewNoteForm from '@/components/CrewNoteForm' // Client Component

export default async function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 space-y-8 text-white">
      <CrewNoteForm />
    </div>
  )
}