import { NextResponse } from "next/server"
import { getAirQualityData, getLatestAirQuality, getAllLocations, insertAirQualityData } from "@/lib/database"
import { fetchAirQualityData } from "@/lib/openweather"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get("locationId")
    const limit = Number.parseInt(searchParams.get("limit") || "24")

    if (locationId) {
      const data = getAirQualityData(Number.parseInt(locationId), limit)
      return NextResponse.json(data)
    } else {
      const locations = getAllLocations()
      const locationsWithLatest = locations.map((location) => {
        const latest = getLatestAirQuality(location.id)
        return { ...location, latest }
      })
      return NextResponse.json(locationsWithLatest)
    }
  } catch (error) {
    console.error("Error fetching air quality data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { locationId } = await request.json()
    const locations = getAllLocations()
    const location = locations.find((l) => l.id === locationId)

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    // Fetch fresh data from OpenWeather API
    const freshData = await fetchAirQualityData(location.latitude, location.longitude)
    freshData.location_id = locationId

    // Store in database
    insertAirQualityData(freshData)

    return NextResponse.json({ success: true, data: freshData })
  } catch (error) {
    console.error("Error updating air quality data:", error)
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
}
