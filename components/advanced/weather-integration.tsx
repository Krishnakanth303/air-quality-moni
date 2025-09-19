"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number
  condition: string
  icon: string
}

interface WeatherIntegrationProps {
  locationName: string
  aqi: number
  className?: string
}

// Mock weather data generator for demo
function generateMockWeatherData(): WeatherData {
  const conditions = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Hazy"]
  const icons = ["sun", "partly-cloudy", "cloudy", "rain", "haze"]
  
  const conditionIndex = Math.floor(Math.random() * conditions.length)
  
  return {
    temperature: Math.round(Math.random() * 15 + 20), // 20-35°C
    humidity: Math.round(Math.random() * 40 + 40), // 40-80%
    windSpeed: Math.round(Math.random() * 15 + 5), // 5-20 km/h
    windDirection: Math.round(Math.random() * 360), // 0-360°
    pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
    visibility: Math.round(Math.random() * 8 + 2), // 2-10 km
    condition: conditions[conditionIndex],
    icon: icons[conditionIndex]
  }
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function getWeatherIcon(condition: string) {
  switch (condition.toLowerCase()) {
    case "clear": return <Sun className="h-8 w-8 text-yellow-500" />
    case "partly cloudy": return <Cloud className="h-8 w-8 text-gray-400" />
    case "cloudy": return <Cloud className="h-8 w-8 text-gray-600" />
    case "light rain": return <CloudRain className="h-8 w-8 text-blue-500" />
    case "hazy": return <Eye className="h-8 w-8 text-orange-400" />
    default: return <Sun className="h-8 w-8 text-yellow-500" />
  }
}

function getAQIWeatherCorrelation(aqi: number, weather: WeatherData): {
  correlation: string
  explanation: string
  color: string
} {
  if (weather.condition === "Light Rain" && aqi < 100) {
    return {
      correlation: "Positive",
      explanation: "Rain is helping to clear pollutants from the air",
      color: "text-green-500"
    }
  } else if (weather.windSpeed > 15 && aqi < 150) {
    return {
      correlation: "Positive", 
      explanation: "Strong winds are dispersing pollutants effectively",
      color: "text-green-500"
    }
  } else if (weather.condition === "Hazy" || weather.visibility < 5) {
    return {
      correlation: "Negative",
      explanation: "Poor visibility indicates high pollution levels",
      color: "text-red-500"
    }
  } else if (weather.windSpeed < 5 && aqi > 100) {
    return {
      correlation: "Negative",
      explanation: "Low wind speed is allowing pollutants to accumulate",
      color: "text-orange-500"
    }
  } else {
    return {
      correlation: "Neutral",
      explanation: "Weather conditions have minimal impact on air quality",
      color: "text-blue-500"
    }
  }
}

export function WeatherIntegration({ locationName, aqi, className = "" }: WeatherIntegrationProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setWeatherData(generateMockWeatherData())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [locationName])

  if (loading) {
    return (
      <Card className={`glass ${className}`}>
        <CardHeader>
          <CardTitle>Weather Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded-lg" />
              <div className="h-16 bg-muted rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) return null

  const correlation = getAQIWeatherCorrelation(aqi, weatherData)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Weather & Air Quality Correlation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Weather */}
          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weatherData.condition)}
              <div>
                <h3 className="font-semibold text-lg">{weatherData.condition}</h3>
                <p className="text-sm text-muted-foreground">{locationName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-sm text-muted-foreground">Feels like {weatherData.temperature + 2}°C</div>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-semibold">{weatherData.humidity}%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Wind className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-semibold">{weatherData.windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">
                  {getWindDirection(weatherData.windDirection)} Wind
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Gauge className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-semibold">{weatherData.pressure} hPa</div>
                <div className="text-xs text-muted-foreground">Pressure</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Eye className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-semibold">{weatherData.visibility} km</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-semibold">{Math.round(weatherData.temperature * 1.8 + 32)}°F</div>
                <div className="text-xs text-muted-foreground">Fahrenheit</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
              <Wind className="h-5 w-5 text-indigo-500" />
              <div>
                <div className="font-semibold">{weatherData.windDirection}°</div>
                <div className="text-xs text-muted-foreground">Wind Dir</div>
              </div>
            </div>
          </div>

          {/* Correlation Analysis */}
          <div className="p-4 border border-border/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Weather Impact on Air Quality</h4>
              <Badge className={correlation.color.replace('text-', 'bg-').replace('-500', '-500/20')}>
                {correlation.correlation}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{correlation.explanation}</p>
            
            {/* Impact Factors */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Wind Dispersion Effect</span>
                  <span>{weatherData.windSpeed > 10 ? 'High' : weatherData.windSpeed > 5 ? 'Medium' : 'Low'}</span>
                </div>
                <Progress value={Math.min(weatherData.windSpeed * 5, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Atmospheric Clarity</span>
                  <span>{weatherData.visibility > 8 ? 'Excellent' : weatherData.visibility > 5 ? 'Good' : 'Poor'}</span>
                </div>
                <Progress value={weatherData.visibility * 10} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Precipitation Cleansing</span>
                  <span>{weatherData.condition.includes('Rain') ? 'Active' : 'None'}</span>
                </div>
                <Progress value={weatherData.condition.includes('Rain') ? 80 : 0} className="h-2" />
              </div>
            </div>
          </div>

          {/* Forecast Insight */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sun className="h-4 w-4" />
              24-Hour Outlook
            </h4>
            <p className="text-sm text-muted-foreground">
              {weatherData.windSpeed > 15 
                ? "Strong winds expected to improve air quality by dispersing pollutants."
                : weatherData.condition.includes('Rain')
                ? "Rain will help wash pollutants from the atmosphere, improving air quality."
                : weatherData.visibility < 5
                ? "Poor visibility suggests continued high pollution levels. Consider indoor activities."
                : "Stable weather conditions. Air quality likely to remain at current levels."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}