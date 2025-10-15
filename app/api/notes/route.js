// src/app/api/notes/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure this path is correct

// --- GET Request (No password needed, since log is public) ---
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc', // Newest at the top
      },
    });
    return NextResponse.json(notes);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch notes." }),
      { status: 500 }
    );
  }
}


// --- POST Request (Requires the shared secret password) ---
export async function POST(request) {
  // 1. Get data from the client request
  const { content, password } = await request.json();

  // 2. **SECURITY CHECK:** Compare the submitted password to the environment variable.
  // The environment variable (process.env.SHIP_LOG_PASSWORD) is only visible on the server.
  if (password !== process.env.SHIP_LOG_PASSWORD) {
    // Fail immediately and return a 401 Unauthorized response
    return new NextResponse(
      JSON.stringify({ message: "Invalid crew password. Entry not logged." }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. If password is valid, create the note in the database
  try {
    const newNote = await prisma.note.create({
      data: {
        content,
      },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Database failed to create note." }),
      { status: 500 }
    );
  }
}