// app/api/submission/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const submissions = await prisma.submission.findMany();
  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedNumber = parseInt(body.number, 10);
  if (isNaN(parsedNumber)) {
    return NextResponse.json({ error: 'Invalid number' }, { status: 400 });
  }
  const newSubmission = await prisma.submission.create({
    data: {
      ...body,
      number: parsedNumber,
    }
  });
  return NextResponse.json(newSubmission);
}
