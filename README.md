# SlotSwapper

**SlotSwapper** is a peer-to-peer time-slot swapping web application.  
Users create calendar events (busy slots), mark them as **SWAPPABLE**, browse others' swappable slots in a marketplace, request swaps, and accept/reject incoming requests. The backend is Node.js + Express (ES modules) with MongoDB, and the frontend is React (Vite) with Tailwind CSS.

---

## Tech stack
- Frontend: React (Vite), React Router v6, Axios, Tailwind CSS  
- Backend: Node.js (ES modules), Express, Mongoose (MongoDB)  
- Auth: JWT (Bearer token)  
- DB: MongoDB Atlas (or local MongoDB)

---

## Project structure
```bash
SlotSwapper/
├── client/ # React frontend (Vite)
│ ├── src/
│ ├── package.json
│ └── .env.example
├── server/ # Express backend (ES modules)
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ ├── package.json
│ └── .env.example
├── .gitignore
└── README.md
```
---

## Key design choices & notes
- **Status-based event model:** each event has `status: BUSY | SWAPPABLE | SWAP_PENDING`. This avoids an extra boolean and makes the lifecycle explicit.
- **SwapRequest model:** stores `mySlot`, `theirSlot`, `fromUser`, `toUser`, and `status` (`PENDING`, `ACCEPTED`, `REJECTED`).
- **ES Modules:** backend uses `"type": "module"` so code uses `import/export`.
- **Simple UI:** Dashboard to manage events, Marketplace to browse swaps, Requests to accept/reject. JWT stored in `localStorage` and sent via Axios interceptor.

---

## Local setup — step by step

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/SlotSwapper.git
```
### 2. Backend setup
```bash
cd server
cp .env.example .env   # open .env and fill values (MONGO_URI, JWT_SECRET)
npm install
npm run dev            # runs nodemon server.js
# Backend will run on port in .env (default 5000)
```
server/.env.example

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/slotswapper
JWT_SECRET=your_jwt_secret_here

### 3. Frontend setup
Open a new terminal:
```bash
cd client
cp .env.example .env   # set API URL
npm install
npm run dev            # starts Vite, usually at http://localhost:5173
```
client/.env.example
VITE_API_URL=http://localhost:5000/api

### 4. Register and test

Open frontend: http://localhost:5173/
Register a user → Login
Dashboard → Add events (use datetime-local inputs)
Mark events as Mark Swappable
Marketplace → see other users' swappable slots
Requests → accept/reject

