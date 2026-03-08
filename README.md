# 💱 Currency Analytics Dashboard

A modern **Currency Converter & Market Analytics Dashboard** built with **FastAPI (Backend)** and **React + Vite (Frontend)**.
The application allows users to convert currencies in real time and visualize currency market trends through an interactive dashboard.

This project was designed as a **full-stack web application** demonstrating API integration, responsive UI design, and deployment using modern developer tools.

---

#  Live Demo

Frontend (Vercel)
https://currency-analytics-f2.vercel.app/

Backend API (Render)
https://currency-analytics-f2.onrender.com/docs

---

#  Features

### 💱 Currency Conversion

* Convert between multiple international currencies
* Real-time exchange rate data
* Automatic rate calculation

### Country Flags

* Currency dropdown with country flags
* Improves visual identification of currencies

### Market Trends Panel

* Displays selected currency trend
* Helps visualize forex movement

### Swap Currency

* Instantly swap **From / To** currencies

### Conversion History

* Shows recent conversion results
* Stored in browser local storage

### Responsive UI

* Fully responsive dashboard
* Works on **mobile, tablet, and desktop**

---

# Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS
* Axios

## Backend

* FastAPI
* Python
* REST API

## Deployment

* Frontend → Vercel
* Backend → Render

---

# Project Structure

```
currency_analytics_f2
│
├── Backends
│   ├── main.py
│   ├── routes.py
│   ├── config.py
│   ├── requirements.txt
│   └── services
│
└── frontend
    ├── src
    ├── package.json
    └── vite.config.js
```

---

# Installation (Local Development)

## Clone the Repository

```
git clone https://github.com/Kunal-t20/currency_analytics_f2.git
cd currency_analytics_f2
```

---

## Backend Setup

```
cd Backends
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
```

Run the server

```
uvicorn main:app --reload
```

Backend runs at

```
http://localhost:8000
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# API Example

Currency Conversion Endpoint

```
GET /convert?from=USD&to=INR&amount=1
```

Example Response

```
{
  "converted_amount": 82.91
}
```

---

# Future Improvements

* Real-time forex candlestick charts
* Currency comparison dashboard
* Dark / Light theme toggle
* Market movers panel
* AI-based currency prediction

---

