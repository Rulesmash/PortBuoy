# HarborMind - AI Port Logistics

HarborMind is the AI-powered operating system for modern port logistics. It aims to eliminate congestion, reduce idle times, and track ESG (Environmental, Social, and Governance) metrics in real-time.

## Features

- **AI Prediction Engine**: Forecast congestion up to 24 hours in advance using historical data and predictive analytics.
- **Smart Booking System**: Automated slot management that dynamically adjusts based on terminal capacity to smooth out peak traffic.
- **ESG & Sustainability**: Real-time carbon footprint monitoring and equivalent impact calculations for green logistics.
- **Multiple Portals**: Support for Admin monitoring, Driver digital gate passes, and Booking management.

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend Templates**: Jinja2 + HTML/Vanilla JS
- **Styling**: Tailwind CSS

## Running the Application

1. Make sure Python 3 is installed.
2. Setup and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate # Linux/Mac
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Start the server (from the inside of `backend` directory):
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

5. Access the application in your browser at `http://localhost:8000`.

## Routes Map

- `/` - Landing Page
- `/login` - Role-based Login Selection
- `/admin` - Admin Logistics Dashboard
- `/driver` - Driver Portal & Digital Pass
- `/booking` - Smart Slot Booking Manager
- `/esg` - Sustainability & ESG Analytics
