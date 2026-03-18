import { APIResponse, SlideData } from "@/types/types";

export async function getSlidesData(): Promise<SlideData[]> {
  try {
    // In a real server environment, we would need the full URL.
    // For local dev and this specific exercise, we call the API.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/content`, {
      cache: "no-store", // Ensure fresh data for now
    });

    if (!res.ok) {
      console.error(`API returned error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: APIResponse = await res.json();
    
    if (!data || !Array.isArray(data.slides)) {
      console.error("Invalid API response format:", data);
      return [];
    }

    return data.slides;
  } catch (error) {
    console.error("Critical error in getSlidesData:", error);
    return [];
  }
}
