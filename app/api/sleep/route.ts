// app/api/sleep/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const sleeps = await prisma.sleep.findMany();
  return NextResponse.json(sleeps);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newSleep = await prisma.sleep.create({ data: body });
  return NextResponse.json(newSleep);
}
