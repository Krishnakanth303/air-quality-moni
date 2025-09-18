// Generate sample historical air quality data
import Database from "better-sqlite3"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, "../air-quality.db"))

// Generate sample data for the last 30 days
const locations = db.prepare("SELECT * FROM locations").all()
const now = new Date()

console.log("Generating sample air quality data...")

for (const location of locations) {
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic air quality data with some variation
    const baseAQI = Math.floor(Math.random() * 150) + 20
    const pm25 = baseAQI * 0.5 + Math.random() * 10
    const pm10 = pm25 * 1.2 + Math.random() * 5
    const o3 = Math.random() * 100 + 20
    const no2 = Math.random() * 50 + 10
    const so2 = Math.random() * 20 + 5
    const co = Math.random() * 10 + 1

    db.prepare(`
            INSERT INTO air_quality_data 
            (location_id, aqi, pm25, pm10, o3, no2, so2, co, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(location.id, baseAQI, pm25, pm10, o3, no2, so2, co, date.toISOString())
  }
}

console.log("Sample data generated successfully!")
db.close()
