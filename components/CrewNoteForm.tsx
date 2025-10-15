// src/components/CrewNoteForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of the component's props
interface CrewNoteFormProps {
  // Function to be called after a successful note submission
  onNoteSubmitted?: () => void; 
}

// Define the shape of the data we send in the POST request
interface FormData {
  content: string;
  password: string;
}

export default function CrewNoteForm({ onNoteSubmitted }: CrewNoteFormProps) {
  const router = useRouter();

  // Explicitly typing the state variables as strings or null
  const [content, setContent] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Type the event as React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Assemble the data object
    const formData: FormData = { 
      content, 
      password 
    };

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      if (res.ok) {
        // Success! Clear the form and refresh the page data
        setContent('');
        setPassword('');
        
        // Notify the parent if a callback was provided
        if (onNoteSubmitted) onNoteSubmitted(); 
        
        // Use router.refresh() to re-fetch the log entries on the page
        router.refresh(); 

      } else {
        // Handle server-side errors (e.g., 401 Unauthorized)
        const data: { message?: string } = await res.json();
        setError(data.message || 'Failed to submit log entry.');
      }
    } catch (err) {
      // Type the error as unknown and cast it for logging/display
      console.error(err);
      setError('A network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h3>Add New Log Entry</h3>
      <textarea
        placeholder="Log item"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input 
        type="password"
        placeholder="Crew Secret Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Add Log Entry'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
    </form>
  );
}