import { NextResponse } from "next/server"
import { getHealthRecommendation } from "@/lib/database"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const aqi = Number.parseInt(searchParams.get("aqi"))

    if (!aqi) {
      return NextResponse.json({ error: "AQI parameter required" }, { status: 400 })
    }

    const recommendation = getHealthRecommendation(aqi)
    return NextResponse.json(recommendation)
  } catch (error) {
    console.error("Error fetching health recommendation:", error)
    return NextResponse.json({ error: "Failed to fetch recommendation" }, { status: 500 })
  }
}
