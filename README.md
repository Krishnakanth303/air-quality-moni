# 🌬️ Air Quality Monitor - Bengaluru Edition

A premium full-stack air quality monitoring platform with real-time data visualization, health recommendations, and pollution prediction capabilities for Bengaluru city.

![Air Quality Monitor](https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=400&fit=crop&crop=center)

## ✨ Features

- **Real-time Air Quality Data** - Live AQI monitoring across 10 major areas in Bengaluru
- **Premium Design** - Glass morphism effects, smooth animations, and dark theme
- **Advanced Analytics** - Interactive charts and data visualization with Recharts
- **Health Recommendations** - Personalized health advice based on current air quality
- **Pollution Prediction** - AI-powered forecasting for future air quality trends
- **Multi-location Support** - Monitor air quality across different areas of Bengaluru
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Alerts** - Get notified when air quality changes significantly

## 🏙️ Bengaluru Locations Covered

The application monitors air quality across 10 major areas in Bengaluru:

1. **Koramangala** - Tech hub and commercial area
2. **Whitefield** - IT corridor with major tech companies
3. **Electronic City** - Major IT and electronics manufacturing hub
4. **Indiranagar** - Popular residential and commercial area
5. **Jayanagar** - Traditional residential locality
6. **HSR Layout** - Modern residential area
7. **Marathahalli** - IT and residential area
8. **BTM Layout** - Busy residential and commercial area
9. **Banashankari** - Established residential locality
10. **Rajajinagar** - Central Bengaluru residential area

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with premium design tokens
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive data visualization
- **SWR** - Data fetching and caching
- **shadcn/ui** - Premium UI components
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **SQLite** - Lightweight database with pre-populated Bengaluru locations
- **OpenWeather API** - Air quality data source

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **OpenWeather API Key** (free at [openweathermap.org](https://openweathermap.org/api))

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

If using v0.app:
- Click the **Download ZIP** button in the top-right corner
- Extract the ZIP file to your desired location

If using GitHub:
```bash
git clone <your-repo-url>
cd air-quality-monitor
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your OpenWeather API key to `.env.local`:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

**To get your OpenWeather API key:**
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "My API Keys" in your dashboard
4. Copy your API key and paste it in the `.env.local` file

### 4. Database Setup

The application uses SQLite with pre-configured Bengaluru locations. Set up the database:

```bash
# Create database tables and populate with Bengaluru locations
npm run db:setup

# Generate sample historical data for all Bengaluru locations
node scripts/02-seed-sample-data.js
```

**What this creates:**
- Database with 10 Bengaluru locations (Koramangala, Whitefield, Electronic City, etc.)
- Health recommendation categories based on AQI levels
- 30 days of sample historical data for each location
- Proper database indexes for optimal performance

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### First Time Setup

1. **Open the application** in your browser at `http://localhost:3000`
2. **Select a Bengaluru location** from the dropdown menu (default locations include Koramangala, Whitefield, Electronic City, etc.)
3. **Click "Refresh Data"** to fetch real-time air quality data from OpenWeather API
4. **Explore the dashboard** features:
   - Current AQI status with color-coded indicators
   - Real-time pollutant measurements (PM2.5, PM10, O₃, NO₂, SO₂, CO)
   - Interactive charts showing trends and comparisons
   - Health recommendations based on current air quality
   - Pollution predictions for future planning

### Key Features Explained

#### 🏙️ Bengaluru-Specific Features
- **Local Area Monitoring** - Track air quality across major Bengaluru localities
- **Traffic Pattern Analysis** - Understand pollution levels in IT corridors vs residential areas
- **Seasonal Trends** - Monitor air quality changes during monsoon and dry seasons
- **Location Comparison** - Compare air quality between different areas of the city

#### 🎨 Premium Design Elements
- **Glass morphism effects** for modern UI aesthetics
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Dark theme** optimized for extended viewing

#### 📊 Data Visualization
- **AQI Gauge** - Visual representation of current air quality
- **Trend Charts** - Historical data over time for selected Bengaluru area
- **Pollutant Breakdown** - Detailed analysis of individual pollutants
- **Weekly Comparison** - Compare air quality across different time periods

#### 🏥 Health Features
- **Real-time Health Recommendations** based on current AQI levels
- **Activity Suggestions** for outdoor activities in Bengaluru weather
- **Health Tips** for sensitive individuals during high pollution days
- **Alert System** for dangerous air quality levels

#### 🔮 Advanced Features
- **Pollution Prediction Engine** - AI-powered forecasting
- **Location Comparison** - Compare air quality between Bengaluru areas
- **Real-time Alerts** - Get notified of significant changes
- **Historical Data Analysis** - Track long-term trends across the city

## 🔧 Configuration

### Adding New Bengaluru Locations

To add more areas within Bengaluru:

1. **Via Database** - Insert directly into the `locations` table:
```sql
INSERT INTO locations (name, latitude, longitude) VALUES 
('Hebbal', 13.0358, 77.5970),
('Yelahanka', 13.1007, 77.5963);
```

2. **Via API** - POST to `/api/air-quality` with location data
3. **Coordinates for common Bengaluru areas:**
   - MG Road: 12.9716, 77.5946
   - Cunningham Road: 12.9716, 77.5946
   - Malleshwaram: 13.0067, 77.5667
   - Basavanagudi: 12.9395, 77.5684

### Customizing for Other Indian Cities

To adapt this for other Indian cities:

1. **Update locations** in `scripts/01-create-tables.sql`
2. **Modify the README** title and location descriptions
3. **Update sample data generation** in `scripts/02-seed-sample-data.js`
4. **Adjust health recommendations** if needed for local conditions

## 📁 Project Structure

```
air-quality-monitor/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── air-quality/          # Air quality data endpoints
│   │   └── health-recommendations/ # Health advice endpoints
│   ├── globals.css               # Global styles and theme
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main dashboard page
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── charts/                   # Data visualization components
│   ├── health/                   # Health-related components
│   ├── advanced/                 # Advanced feature components
│   └── layout/                   # Layout components
├── lib/                          # Utility libraries
│   ├── database.js               # SQLite database connection
│   ├── openweather.js            # OpenWeather API integration
│   └── utils.ts                  # General utilities
├── scripts/                      # Database setup scripts
│   ├── 01-create-tables.sql      # Database schema with Bengaluru locations
│   └── 02-seed-sample-data.js    # Sample data for all locations
├── .env.local                    # Your environment variables (create this)
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your `OPENWEATHER_API_KEY` in Environment Variables
3. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

```env
OPENWEATHER_API_KEY=your_production_api_key
NODE_ENV=production
```

## 🔍 Troubleshooting

### Common Issues

#### "Unable to load data" Error
- **Check API Key**: Ensure your OpenWeather API key is valid and active
- **Check Network**: Verify internet connection and API accessibility
- **Check Limits**: Free OpenWeather accounts have rate limits (1000 calls/day)
- **Bengaluru Coordinates**: Verify the latitude/longitude values are correct

#### Database Connection Issues
- **File Permissions**: Ensure the app can write to the database file location
- **SQLite Installation**: Verify SQLite is properly installed
- **Path Issues**: Check that the database path is correct in `lib/database.js`
- **Bengaluru Data**: Run `npm run db:setup` to ensure locations are populated

#### No Data for Bengaluru Locations
- **Run Database Setup**: Execute `npm run db:setup` and `node scripts/02-seed-sample-data.js`
- **Check API Response**: Verify OpenWeather API returns data for Bengaluru coordinates
- **Location IDs**: Ensure location IDs in the database match the frontend queries

### Getting Help

If you encounter issues:

1. **Check the Console** - Look for error messages in browser developer tools
2. **Verify Environment** - Ensure `OPENWEATHER_API_KEY` is set correctly
3. **Check API Status** - Verify OpenWeather API is operational
4. **Database Check** - Ensure Bengaluru locations are properly inserted
5. **Review Logs** - Check server logs for detailed error information

## 📊 API Endpoints

### Air Quality Data
- `GET /api/air-quality` - Get all Bengaluru locations with latest data
- `GET /api/air-quality?locationId=1&limit=24` - Get historical data for specific location
- `POST /api/air-quality` - Refresh data for specific Bengaluru location

### Health Recommendations
- `GET /api/health-recommendations?aqi=50` - Get health advice for AQI level

## 🌟 Bengaluru-Specific Features

### Traffic and Pollution Correlation
- Monitor how traffic patterns in areas like Whitefield and Electronic City affect air quality
- Compare pollution levels during peak hours vs off-peak hours

### Seasonal Monitoring
- Track air quality changes during Bengaluru's monsoon season (June-September)
- Monitor winter pollution levels (December-February)
- Observe the impact of festivals like Diwali on air quality

### Area-Specific Insights
- **IT Corridors** (Whitefield, Electronic City): Higher weekday pollution
- **Residential Areas** (Jayanagar, Indiranagar): More consistent levels
- **Commercial Areas** (Koramangala, BTM Layout): Variable based on activity

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- **Follow TypeScript** best practices
- **Use Tailwind CSS** for styling
- **Test with Bengaluru coordinates** to ensure accuracy
- **Write descriptive commit messages**
- **Update documentation** as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeather** for providing the air quality API
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the data visualization components
- **Bengaluru Citizens** for inspiring local environmental monitoring

---

**Built with ❤️ for Bengaluru using v0.app**

Monitor the air quality in India's Silicon Valley and make informed decisions about your daily activities based on real-time environmental data.

For more information or support, please visit [v0.app](https://v0.app)