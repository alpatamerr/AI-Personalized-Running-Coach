# AI Personalized Running Coach

## Project Description

An AI-powered personalized running coach that generates 16-week training plans using OpenAI GPT-4.1 nano. The system analyzes running data and creates personalized training programs based on user goals and performance.

## Core Features

- **AI Training Plans**: OpenAI-powered 16-week progressive training plans
- **Goal Setting**: Multi-step wizard for setting running goals (5K, 10K, Half/Full Marathon)
- **Performance Dashboard**: React-based dashboard with training calendar
- **Strava Integration**: OAuth2 integration for running data (developer account only)
- **Machine Learning**: K-means clustering for performance analysis
- **User Authentication**: Session-based authentication with Passport.js

## Tech Stack

- **Frontend**: React 18, Vite, React Router v7
- **Backend**: Node.js, Express 5, Passport.js
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4.1 nano API
- **ML**: Python, Scikit-learn, K-means clustering

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- OpenAI API key

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd AI-Personalized-Running-Coach
   npm install
   ```

2. **Configure environment**
   Create `server/.env`:
   ```env
   PORT=5000
   SESSION_SECRET=your-secret-key
   DATABASE_URL=postgresql://running_coach_user:running@localhost:5432/running_coach_db
   OPENAI_API_KEY=your-openai-key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Setup database**
   ```bash
   createdb running_coach_db
   pg_restore -d running_coach_db running_coach_db.dump
   ```

4. **Run the application**
   ```bash
   # Backend
   cd server && npm start
   
   # Frontend (new terminal)
   cd client && npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Project Structure

```
AI-Personalized-Running-Coach/
├── client/          # React frontend
├── server/          # Node.js backend
├── ml/              # Python ML scripts
├── running_coach_db.dump  # Pre-populated database
└── README.md
```

## Features

- **AI Training Plans**: Generate personalized 16-week running programs
- **Goal Management**: Set and track running goals
- **Performance Analytics**: Dashboard with training data visualization
- **Strava Sync**: Import running activities and performance metrics
- **Machine Learning**: K-means clustering for performance classification

## Development

- **Frontend**: `cd client && npm run dev`
- **Backend**: `cd server && npm start`
- **Database**: Ensure PostgreSQL is running

## Academic Project

This project demonstrates full-stack development, AI integration, machine learning, and modern software engineering practices. The system is production-ready and suitable for academic evaluation.

## License

ISC License