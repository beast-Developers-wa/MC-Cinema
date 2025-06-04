
# MC-Cinema Deployment Guide

## Prerequisites

* Node.js and npm installed
* Database configured (if needed)
* Environment variables ready

---

## Frontend (client-side) Deployment

1. **Navigate to frontend folder:**

   ```bash
   cd client-side
   ```

2. **Install dependencies:**
   This installs React, Firebase, React Router, React Icons, and other dependencies your project uses.

   ```bash
   npm install react react-dom react-router-dom react-icons firebase
   ```

   Or if you have `package.json` with all dependencies:

   ```bash
   npm install
   ```

3. **Run frontend dev server:**

   ```bash
   npm run dev
   ```

---

## Backend Deployment

1. **Navigate to backend folder:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   Or manually install basics:

   ```bash
   npm install express body-parser cors dotenv
   ```

3. **Start backend server:**

   ```bash
   node server.js
   ```

---

## Access Frontend

Open your browser and go to:

```
http://localhost:5173
```

---
