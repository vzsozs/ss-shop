import { NextResponse } from "next/server";
import content from "@/data/content.json";

export async function GET() {
  return NextResponse.json({ slides: content });
}
