const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = "http://api.openweathermap.org/data/2.5"

export async function fetchAirQualityData(lat, lon) {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured")
  }

  try {
    const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`)

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()
    const pollution = data.list[0]

    return {
      aqi: pollution.main.aqi * 50, // Convert to US AQI scale
      pm25: pollution.components.pm2_5,
      pm10: pollution.components.pm10,
      o3: pollution.components.o3,
      no2: pollution.components.no2,
      so2: pollution.components.so2,
      co: pollution.components.co,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching air quality data:", error)
    throw error
  }
}

export async function fetchForecastData(lat, lon) {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeather API key not configured")
  }

  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`)
    }

    const data = await response.json()

    return data.list.map((item) => ({
      aqi: item.main.aqi * 50,
      pm25: item.components.pm2_5,
      pm10: item.components.pm10,
      o3: item.components.o3,
      no2: item.components.no2,
      so2: item.components.so2,
      co: item.components.co,
      timestamp: new Date(item.dt * 1000).toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    throw error
  }
}
