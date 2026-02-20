# PortBuoy - AI Port Logistics (MVP)

PortBuoy is the AI-powered operating system for modern port logistics. It aims to eliminate congestion, reduce idle times, and track ESG (Environmental, Social, and Governance) metrics in real-time.

Built as a Minimum Viable Product (MVP) to demonstrate smart truck slot booking and predictive congestion modeling.

## 🚀 Features

- **AI Prediction Engine**: Forecasts congestion risk based on real-time slot bookings, yard utilization, and vessel delay scoring.
- **Smart Booking System**: Automated slot management that dynamically prevents terminal overbooking.
- **ESG & Sustainability**: Real-time carbon footprint monitoring calculating emissions produced and emissions saved per truck.
- **Multiple Portals**: Support for Admin monitoring dashboards, Driver digital gate passes, and Fleet Operator booking management.

---

## 📂 Project Structure

This project adopts a decoupled architecture with two distinct services:

1. **/node_api** (The Core Backend API)
   - Built with **Node.js, Express, and MongoDB Analytics**.
   - Handles the heavy lifting: Authentication (JWT), Slot algorithms, ESG tracking, and the Database schema.
   - Includes an auto-generated Seed script to instantly inject 50 Trucks, 20 Slots, and Mock Vessel Data into MongoDB so the application is instantly testable.
   
2. **/python_ui_server** (The Frontend UI Engine)
   - Built with **FastAPI, Jinja2, and Tailwind CSS**.
   - Handles the beautiful, responsive end-user interfaces.
   - Serves the `/admin`, `/driver`, `/booking`, and `/esg` portals.

---

## 🛠️ Quick Start Guide (For Judges & Developers)

### Step 1: Start the API Backend
Open a new terminal and navigate to the `node_api` directory:
```bash
cd node_api
npm install

# Optional: Seed the database with Hackathon test data
npm run seed 

# Start the Node.js API
npm run dev
```
> **Note:** The backend uses MongoDB. A `.env` file is included natively pointing to our cloud MongoDB Atlas cluster, meaning **no local database setup is required!** 

### Step 2: Start the UI Server
Open a **second terminal** and navigate to the `python_ui_server` directory:
```bash
cd python_ui_server

# Install python requirements
pip install -r requirements.txt

# Start the FastAPI UI Renderer
uvicorn main:app --reload
```

### Step 3: View the App!
1. **Frontend App**: Open your browser to -> `http://localhost:8000`
2. **API Documentation (Swagger)**: Open your browser to -> `http://localhost:5000/api-docs`

---

## 🔧 Tech Stack Deep Dive
* **Language Ecosystems**: JavaScript (Backend Logic) & Python (UI Logic)
* **Database**: MongoDB Atlas (Mongoose ODM)
* **Web Frameworks**: Express.js (REST) & FastAPI (Jinja Template Rendering)
* **Frontend**: Vanilla HTML/JS powered by Tailwind CSS

Enjoy judging **PortBuoy**!
