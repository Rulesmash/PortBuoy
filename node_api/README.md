# PortBuoy Backend (Smart Green Gate)

This is the backend for PortBuoy, an AI-powered MVP designed to optimize port logistics, reduce congestion, and track ESG metrics.

## Tech Stack
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication (Role Based: Admin, Operator, Driver)
- **Swagger** for API Documentation
- **Docker** Ready

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Docker)

## Getting Started

### 1. Installation
Navigate to this directory and install dependencies:
```bash
npm install
```

### 2. Environment Variables
The application uses a `.env` file in the root of `node_backend/`. Default variables are provided. Adjust `MONGODB_URI` if your database is hosted elsewhere:
```properties
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portbuoy
JWT_SECRET=supersecretportbuoykey2024
JWT_EXPIRE=30d
```

### 3. Seed Database (Optional but Recommended)
To populate the database with dummy users, trucks, slots, vessel scenarios, and completed bookings with calculated emissions:
```bash
npm run seed
```

### 4. Running the Server

#### Development Mode (with Nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 5. Running with Docker Compose
If you prefer running both the app and a MongoDB instance via Docker:
```bash
docker-compose up -d --build
```

---

## API Documentation (Swagger)
Once the server is running, visit the auto-generated interactive OpenAPI/Swagger documentation at:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## Core Workflows
1. **Authentication**: Admin/Operator/Driver roles authenticate via `/api/auth/register` or `/api/auth/login`. Output is a Bearer Token.
2. **Trucks**: Operators/Drivers manage vehicles via `/api/trucks`.
3. **Slots**: Admins create schedules (`/api/slots`). Booking algorithms check capacity and delay risk prior to assignment.
4. **Congestion Prediction**: A simulated engine runs on `/api/slots/:id/congestion` predicting risk based on yard usage and vessel delays.
5. **Dashboard & Emissions**: Admins can hit `/api/admin/dashboard` to get rollup statistics of activity and emissions saved today.
