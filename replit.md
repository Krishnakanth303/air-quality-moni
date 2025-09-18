# Air Quality Monitor - Bengaluru Edition

**Date:** September 18, 2025
**Status:** Successfully imported and configured for Replit environment

## Project Overview

This is a premium full-stack air quality monitoring application specifically designed for Bengaluru city. The app provides real-time air quality data visualization, health recommendations, and pollution prediction capabilities across 10 major areas in Bengaluru.

## Architecture

- **Frontend:** Next.js 15 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend:** Node.js with Next.js API routes
- **Database:** SQLite with better-sqlite3 for local data storage
- **External API:** OpenWeather API for real-time air quality data
- **Deployment:** Configured for autoscale deployment on Replit

## Recent Changes (September 18, 2025)

### Database Setup
- ✅ Fixed database schema to use Bengaluru locations instead of US cities
- ✅ Populated database with 10 major Bengaluru areas:
  - Koramangala, Whitefield, Electronic City, Indiranagar, Jayanagar
  - HSR Layout, Marathahalli, BTM Layout, Banashankari, Rajajinagar
- ✅ Generated sample historical data for all locations
- ✅ Set up health recommendation categories based on AQI levels

### Replit Configuration
- ✅ Configured Next.js for Replit proxy environment
- ✅ Added allowedDevOrigins for Replit domains
- ✅ Set up cache control headers for development
- ✅ Configured workflow on port 5000 with proper hostname settings
- ✅ Installed required system dependencies (sqlite)

### Environment Setup
- ✅ Created .env.local template for OpenWeather API key
- ✅ Configured deployment settings for autoscale deployment

## Current State

The application is fully functional with:
- ✅ Development server running on port 5000
- ✅ Database populated with Bengaluru locations and sample data
- ✅ All API endpoints working correctly (/api/air-quality, /api/health-recommendations)
- ✅ Frontend loading and displaying data properly
- ✅ Deployment configuration ready

## Required Configuration

**IMPORTANT:** To fully activate the application, users need to:
1. Add their OpenWeather API key to the environment variables
2. Replace `your_api_key_here` in .env.local with a real API key from openweathermap.org

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - React components (UI, charts, health, advanced features)
- `/lib` - Utility libraries (database connection, OpenWeather API integration)
- `/scripts` - Database setup and seeding scripts
- `/public` - Static assets
- `air-quality.db` - SQLite database with Bengaluru locations data

## Key Features

- Real-time air quality monitoring for 10 Bengaluru locations
- Interactive data visualization with Recharts
- Health recommendations based on AQI levels
- Premium UI with glass morphism effects and dark theme
- Responsive design for all devices
- Advanced features: prediction engine, location comparison, real-time alerts

## User Preferences

- The application is configured for the Indian/Bengaluru context
- Uses modern Next.js 15 patterns with TypeScript
- Follows premium design standards with smooth animations
- Optimized for both development and production deployment on Replit