import { NextResponse } from "next/server";
import content from "@/data/content.json";

export async function GET() {
  console.log("API hívás érkezett");
  return NextResponse.json({ slides: content });
}
