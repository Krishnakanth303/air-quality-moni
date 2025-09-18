import Database from "better-sqlite3"
import { join } from "path"

let db

export function getDatabase() {
  if (!db) {
    db = new Database(join(process.cwd(), "air-quality.db"))
    db.pragma("journal_mode = WAL")
  }
  return db
}

export function getAirQualityData(locationId, limit = 24) {
  const db = getDatabase()
  return db
    .prepare(`
        SELECT * FROM air_quality_data 
        WHERE location_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
    `)
    .all(locationId, limit)
}

export function getLatestAirQuality(locationId) {
  const db = getDatabase()
  return db
    .prepare(`
        SELECT * FROM air_quality_data 
        WHERE location_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
    `)
    .get(locationId)
}

export function getHealthRecommendation(aqi) {
  const db = getDatabase()
  return db
    .prepare(`
        SELECT * FROM health_recommendations 
        WHERE ? BETWEEN aqi_min AND aqi_max
    `)
    .get(aqi)
}

export function getAllLocations() {
  const db = getDatabase()
  return db.prepare("SELECT * FROM locations").all()
}

export function insertAirQualityData(data) {
  const db = getDatabase()
  return db
    .prepare(`
        INSERT INTO air_quality_data 
        (location_id, aqi, pm25, pm10, o3, no2, so2, co, timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      data.location_id,
      data.aqi,
      data.pm25,
      data.pm10,
      data.o3,
      data.no2,
      data.so2,
      data.co,
      data.timestamp || new Date().toISOString(),
    )
}
