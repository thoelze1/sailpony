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

interface Status {
  message: string | null;
  type: 'success' | 'error' | null;
}

export default function CrewNoteForm({ onNoteSubmitted }: CrewNoteFormProps) {
  const router = useRouter();

  // Explicitly typing the state variables as strings or null
  const [content, setContent] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>({ message: null, type: null });
  
  // Type the event as React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus({ message: null, type: null }); // Clear previous status
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
        setStatus({ message: null, type: null }); // Clear previous status
        
        // Notify the parent if a callback was provided
        if (onNoteSubmitted) onNoteSubmitted(); 
        
        // Use router.refresh() to re-fetch the log entries on the page
        router.refresh(); 

      } else {
        // Handle server-side errors (e.g., 401 Unauthorized)
        const data: { message?: string } = await res.json();
        setError(data.message || 'Failed to submit log entry.');
        setStatus({ 
          message: data.message || 'Failed to submit log entry. Check your password.', 
          type: 'error' 
        }); 
      }
    } catch (err) {
      // Type the error as unknown and cast it for logging/display
      console.error(err);
      setError('A network error occurred.');
      setStatus({ message: 'A network error occurred. Please try again.', type: 'error' }); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Log Content Area - Prominent and Sexy */}
            <div className="flex flex-col">
                <label htmlFor="content" className="text-lg font-medium text-gray-300 mb-2">
                    Log Note
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    required
                    disabled={isSubmitting}
                    placeholder="whatever you want to share!"
                    className="
                        w-full p-4 text-gray-100 bg-gray-900 border border-gray-700 rounded-xl shadow-inner
                        transition duration-200 
                        focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                        placeholder-gray-500 resize-none
                    "
                />
            </div>

            {/* Password Input - Grouped and Sleek */}
            <div className="flex flex-col">
                <label htmlFor="password" className="text-lg font-medium text-gray-300 mb-2">
                    Super Secret Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="crew only ;)"
                    className="
                        w-full p-3 text-gray-100 bg-gray-900 border border-gray-700 rounded-xl shadow-inner
                        transition duration-200 
                        focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400
                        placeholder-gray-500
                    "
                />
            </div>

            {/* Status Message */}
            {status.message && (
                <div 
                    className={`p-3 rounded-xl font-medium text-center ${
                        status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-600' : 
                        'bg-red-500/20 text-red-400 border border-red-600'
                    }`}
                >
                    {status.message}
                </div>
            )}

            {/* Submit Button - Vibrant and Interactive */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`
                    w-full py-3 px-6 text-lg font-bold rounded-xl shadow-lg 
                    transition duration-300 ease-in-out transform 
                    ${isSubmitting 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-teal-600 hover:bg-teal-500 text-white hover:scale-[1.01] hover:shadow-teal-500/50 active:bg-teal-700'
                    }
                `}
            >
                {isSubmitting ? 'Recording Entry...' : '⛵ Add Log Entry'}
            </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </form>
  );
}