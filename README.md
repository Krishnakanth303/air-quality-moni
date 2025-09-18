# 🌬️ Air Quality Monitor

A premium full-stack air quality monitoring platform with real-time data visualization, health recommendations, and pollution prediction capabilities.

![Air Quality Monitor](https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=400&fit=crop&crop=center)

## ✨ Features

- **Real-time Air Quality Data** - Live AQI monitoring with OpenWeather API integration
- **Premium Design** - Glass morphism effects, smooth animations, and dark theme
- **Advanced Analytics** - Interactive charts and data visualization with Recharts
- **Health Recommendations** - Personalized health advice based on current air quality
- **Pollution Prediction** - AI-powered forecasting for future air quality trends
- **Multi-location Support** - Monitor air quality across different cities
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Alerts** - Get notified when air quality changes significantly

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
- **SQLite** - Lightweight database
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
\`\`\`bash
git clone <your-repo-url>
cd air-quality-monitor
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your OpenWeather API key to `.env.local`:

\`\`\`env
OPENWEATHER_API_KEY=your_api_key_here
\`\`\`

**To get your OpenWeather API key:**
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to "My API Keys" in your dashboard
4. Copy your API key and paste it in the `.env.local` file

### 4. Database Setup

The application uses SQLite for data storage. Run the setup scripts:

\`\`\`bash
# Create database tables
npm run db:setup

# Seed with sample data (optional)
npm run db:seed
\`\`\`

**Manual setup (if scripts don't work):**
1. The database file will be created automatically at `./air_quality.db`
2. Tables will be created on first API call
3. Sample data will be populated automatically

### 5. Start the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### First Time Setup

1. **Open the application** in your browser
2. **Select a location** from the dropdown menu
3. **Click "Refresh Data"** to fetch initial air quality data
4. **Explore the dashboard** features:
   - Current AQI status with color-coded indicators
   - Real-time pollutant measurements (PM2.5, PM10, O₃, NO₂, SO₂, CO)
   - Interactive charts showing trends and comparisons
   - Health recommendations based on current air quality
   - Pollution predictions for future planning

### Key Features Explained

#### 🎨 Premium Design Elements
- **Glass morphism effects** for modern UI aesthetics
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Dark theme** optimized for extended viewing

#### 📊 Data Visualization
- **AQI Gauge** - Visual representation of current air quality
- **Trend Charts** - Historical data over time
- **Pollutant Breakdown** - Detailed analysis of individual pollutants
- **Weekly Comparison** - Compare air quality across different time periods

#### 🏥 Health Features
- **Real-time Health Recommendations** based on current AQI levels
- **Activity Suggestions** for outdoor activities
- **Health Tips** for sensitive individuals
- **Alert System** for dangerous air quality levels

#### 🔮 Advanced Features
- **Pollution Prediction Engine** - AI-powered forecasting
- **Location Comparison** - Compare air quality between cities
- **Real-time Alerts** - Get notified of significant changes
- **Historical Data Analysis** - Track long-term trends

## 🔧 Configuration

### Adding New Locations

To add new monitoring locations, you can:

1. **Via API** - POST to `/api/air-quality` with location data
2. **Via Database** - Insert directly into the `locations` table
3. **Via Admin Panel** - Use the built-in location management (if enabled)

### Customizing Themes

The application uses CSS custom properties for theming. Edit `app/globals.css` to customize:

\`\`\`css
:root {
  --primary: oklch(0.7 0.15 280); /* Primary brand color */
  --background: oklch(0.08 0 0);  /* Background color */
  /* ... other theme variables */
}
\`\`\`

### API Configuration

The OpenWeather API integration can be customized in `lib/openweather.js`:

- **Update frequency** - Modify the data fetching intervals
- **Additional parameters** - Add more weather data points
- **Error handling** - Customize error responses

## 📁 Project Structure

\`\`\`
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
│   ├── 01-create-tables.sql      # Database schema
│   └── 02-seed-sample-data.js    # Sample data insertion
├── .env.example                  # Environment variables template
├── .env.local                    # Your environment variables (create this)
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your `OPENWEATHER_API_KEY` in Environment Variables
3. **Deploy** - Vercel will automatically build and deploy your app

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:

- **Netlify** - Add build command: `npm run build`
- **Railway** - Automatic deployment from GitHub
- **DigitalOcean App Platform** - Container-based deployment
- **AWS/Google Cloud** - Using their respective app services

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

\`\`\`env
OPENWEATHER_API_KEY=your_production_api_key
NODE_ENV=production
\`\`\`

## 🔍 Troubleshooting

### Common Issues

#### "Unable to load data" Error
- **Check API Key**: Ensure your OpenWeather API key is valid and active
- **Check Network**: Verify internet connection and API accessibility
- **Check Limits**: Free OpenWeather accounts have rate limits (1000 calls/day)

#### Database Connection Issues
- **File Permissions**: Ensure the app can write to the database file location
- **SQLite Installation**: Verify SQLite is properly installed
- **Path Issues**: Check that the database path is correct in `lib/database.js`

#### Styling Issues
- **Clear Cache**: Clear browser cache and restart the development server
- **Check Tailwind**: Ensure Tailwind CSS is properly configured
- **Verify Imports**: Check that all component imports are correct

#### Performance Issues
- **API Rate Limiting**: Implement caching to reduce API calls
- **Database Optimization**: Add indexes for frequently queried columns
- **Image Optimization**: Use Next.js Image component for better performance

### Getting Help

If you encounter issues:

1. **Check the Console** - Look for error messages in browser developer tools
2. **Verify Environment** - Ensure all environment variables are set correctly
3. **Check API Status** - Verify OpenWeather API is operational
4. **Review Logs** - Check server logs for detailed error information

## 📊 API Endpoints

### Air Quality Data
- `GET /api/air-quality` - Get all locations with latest data
- `GET /api/air-quality?locationId=1&limit=24` - Get historical data for location
- `POST /api/air-quality` - Refresh data for specific location

### Health Recommendations
- `GET /api/health-recommendations?aqi=50` - Get health advice for AQI level

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
- **Write descriptive commit messages**
- **Test your changes** thoroughly
- **Update documentation** as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeather** for providing the air quality API
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the data visualization components

---

**Built with ❤️ using v0.app**

For more information or support, please visit [v0.app](https://v0.app)
# air-quality-mon
