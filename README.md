# AI-Personalized-Running-Coach

## Project Description

An AI-powered personalized running coach that generates adaptive training plans based on users’ running data and goals. The system integrates with Strava’s API to fetch real running metrics (distance, pace, cadence, heart rate) and uses these along with user preferences to create and adjust 12–16 week training plans.

### Core Features
1. **User Profile & Goal Setting**:
   - Users can set running goals (e.g., completing a 5K under 26 minutes).
   - Preferences and training history are stored in PostgreSQL.

2. **Strava Integration**:
   - OAuth2 integration to fetch user data (pace, cadence, heart rate, distance) from Strava's REST API.

3. **Training Plan Generator**:
   - Generates weekly running plans based on current stats and goals.

4. **AI-Based Adjustments**:
   - Applies machine learning models (such as linear regression and decision trees) to produce adaptive 12 to 16-week training plan adjustments based on ongoing performance and user-provided inputs.

5. **Performance Dashboard**:
   - React-based dashboard to visualize weekly progress, pace, cadence over time, and goal tracking.

### Tech Stack
- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **ML Service**: Python (Flask/FastAPI), scikit-learn, pandas
- **Database**: PostgreSQL
- **APIs**: Strava
- **Deployment**: Docker (optional)

---
## Folder Structure
```plaintext
AI-Personalized-Running-Coach/
├── client/   # React frontend
├── server/   # Node.js + Express backend
├── ml/       # Python ML service
├── db/       # SQL scripts, migration files, or database-related code
├── docker/   # Optional Docker configuration
├── README.md
└── .gitignore
```

## How to Contribute
1. Clone the repository.
2. Set up the environment and dependencies for the specific folder (e.g., `/client`, `/server`, or `/ml`).
3. Submit a pull request with your changes.
