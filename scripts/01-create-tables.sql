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

-- Insert Bengaluru locations
INSERT OR REPLACE INTO locations (name, latitude, longitude) VALUES
('Koramangala', 12.9279, 77.6271),
('Whitefield', 12.9698, 77.7500),
('Electronic City', 12.8456, 77.6603),
('Indiranagar', 12.9784, 77.6408),
('Jayanagar', 12.9249, 77.5832),
('HSR Layout', 12.9081, 77.6476),
('Marathahalli', 12.9591, 77.6974),
('BTM Layout', 12.9165, 77.6101),
('Banashankari', 12.9081, 77.5674),
('Rajajinagar', 12.9915, 77.5520);
