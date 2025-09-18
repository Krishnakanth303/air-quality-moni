-- Create air quality monitoring database tables
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS air_quality_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER NOT NULL,
    aqi INTEGER NOT NULL,
    pm25 REAL,
    pm10 REAL,
    o3 REAL,
    no2 REAL,
    so2 REAL,
    co REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations (id)
);

CREATE TABLE IF NOT EXISTS health_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aqi_min INTEGER NOT NULL,
    aqi_max INTEGER NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    message TEXT NOT NULL,
    recommendations TEXT NOT NULL
);

-- Insert default health recommendations
INSERT OR REPLACE INTO health_recommendations (aqi_min, aqi_max, category, color, message, recommendations) VALUES
(0, 50, 'Good', '#00E400', 'Air quality is satisfactory', 'Perfect for outdoor activities. Enjoy fresh air!'),
(51, 100, 'Moderate', '#FFFF00', 'Air quality is acceptable', 'Sensitive individuals should consider limiting prolonged outdoor exertion'),
(101, 150, 'Unhealthy for Sensitive Groups', '#FF7E00', 'Sensitive groups may experience health effects', 'Children, elderly, and people with respiratory conditions should limit outdoor activities'),
(151, 200, 'Unhealthy', '#FF0000', 'Everyone may experience health effects', 'Avoid outdoor activities. Keep windows closed and use air purifiers'),
(201, 300, 'Very Unhealthy', '#8F3F97', 'Health alert for everyone', 'Stay indoors. Avoid all outdoor activities. Use masks if you must go outside'),
(301, 500, 'Hazardous', '#7E0023', 'Emergency conditions', 'Stay indoors with air purifiers. Seek medical attention if experiencing symptoms');

-- Insert sample locations
INSERT OR REPLACE INTO locations (name, latitude, longitude) VALUES
('New York City', 40.7128, -74.0060),
('Los Angeles', 34.0522, -118.2437),
('Chicago', 41.8781, -87.6298),
('Houston', 29.7604, -95.3698),
('Phoenix', 33.4484, -112.0740);
