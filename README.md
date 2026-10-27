# ⚡ EventHive — College Event Platform

> **The premier campus hub for Hackathons, Cultural Fests, Tech Summits, Bootcamps, and Student Club Life.**  
> Fully integrated full-stack web application with **React (Vite + Tailwind CSS)** frontend and **Node.js + Express** backend, backed by **MongoDB Community Server** and compatible with **MongoDB Compass**.

---

## 🌟 Overview & Key Features

EventHive is tailored for college ecosystems—bringing students, technical chapters, cultural societies, and event organizers together into an interactive, high-voltage platform.

### ✨ Implemented Interfaces & Capabilities:

1. **Working Create Account (Register) Page**:
   - Tailored to university students and faculty organizers:
     - Full Name, College/Personal Email, Password & Confirmation
     - University Name, Student Roll/ID Number
     - Department/Branch (Computer Science, IT, Electronics, Mechanical, Business, Arts)
     - Academic Year (1st, 2nd, 3rd, 4th Year, Postgrad)
     - Role Selection (Student Attendee vs. Club Organizer)
   - **Direct MongoDB Persistence**: User accounts are hashed using `bcryptjs` and saved directly to the `users` collection in the MongoDB database `eventhive`.
   - Includes **1-Click Demo Fill buttons** for rapid testing.

2. **Working Login Page**:
   - Secure login verifying hashed credentials against MongoDB.
   - Generates JWT tokens stored in `localStorage` with request interceptor synchronization.
   - Includes **Instant 1-Click Test Login buttons**:
     - **Demo Student**: `alex.student@college.edu` / `password123`
     - **Demo Organizer**: `priya.organizer@campus.edu` / `password123`

3. **Explore & Discovery Hub (`/events`)**:
   - Campus Spotlight Hero Banner showcasing featured flagship events.
   - Real-time search by title, organizing club, venue, or keywords.
   - Category filtering pills: *All, Hackathons, Cultural Fests, Tech Fests, Workshops, Sports & E-Sports, Seminars & Talks, Design & Arts*.
   - Filter by Mode (*In-Person, Hybrid, Online*), Price (*Free RSVP vs Paid*), and Sorting (*Popular, Earliest Date, Highest Capacity*).
   - Live Capacity Progress Bars (visual indicator showing remaining spots and sold-out states).

4. **Event Details & Interactive RSVP Modal**:
   - Comprehensive modal detailing agenda milestones, timeline, participation rules, organizer contacts, and venue.
   - One-click RSVP modal supporting **Team Registration** (Team Name & Teammates) and special hardware/dietary requests.
   - Generates a **unique digital entry ticket code** (e.g. `EH-2026-X89B`) stored in MongoDB `registrations`.

5. **"My Campus Passes & Tickets" Interface (`/my-tickets`)**:
   - Student digital wallet rendering **Boarding Pass / Festival Badge style tickets**.
   - Features simulated QR codes, unique monospace ticket IDs, attendee student ID, and date/venue.
   - Native **Print / Save Pass** function.
   - Real-time **Cancel RSVP** button that updates attendee counters in MongoDB.

6. **"Host an Event / Create Event" Interface (`/create-event`)**:
   - Interactive event creation wizard: Title, Tagline, Category, Host Club, Venue, Date, Time, Entry Fee, Prize Pool, Capacity, Schedule Milestones, Rules, and Banner image picker.
   - Persists immediately to MongoDB `events` collection.

7. **"Campus Clubs & Societies Directory" (`/clubs`)**:
   - Directory cards for student chapters: *Google Developer Student Club (GDSC), ACM Student Chapter, Robotics & Automation Cell, Crescendo Music Society, CyberKnights, Zenith Esports, and E-Cell*.
   - Displays lead organizers, member counts, meeting locations, and active event filters.

8. **"Campus Pulse & Community Analytics" (`/buzz`)**:
   - Live telemetry dashboard tracking Total Events, Active RSVPs, Prize Pools, Department Engagement Leaderboards, and MongoDB database health.

---

## 🗄️ Database & MongoDB Compass Guide

EventHive uses **MongoDB Community Server** running locally on Windows.

### MongoDB Connection Details:
- **Host / Port**: `127.0.0.1:27017`
- **Database Name**: `eventhive`
- **Compass Connection URI**:  
  ```text
  mongodb://127.0.0.1:27017/eventhive
  ```
  *(or simply `mongodb://127.0.0.1:27017`)*

### Inspecting Data in MongoDB Compass:
1. Open **MongoDB Compass** on your computer.
2. In the "New Connection" screen, enter the URI:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the left sidebar, click on the **`eventhive`** database. You will see three collections:
   - **`users`**: Contains registered student & organizer accounts (with hashed passwords, college, department, student ID).
   - **`events`**: Contains all college hackathons, fests, workshops, schedules, and prize pools.
   - **`registrations`**: Contains student RSVPs, generated ticket codes (e.g., `EH-2026-X89B`), and team member rosters.

### MongoDB Service Troubleshooting (Windows):
MongoDB is already configured and running as a Windows Service (`MongoDB Server (MongoDB)`). If you ever need to verify or start it manually:
- Open PowerShell as Administrator and run:
  ```powershell
  Start-Service MongoDB
  # or
  net start MongoDB
  ```
- Or press `Win + R`, type `services.msc`, locate `MongoDB Server (MongoDB)`, and ensure its status is **Running**.

---

## 📂 Project Architecture

```
25070521343/
├── client/                      # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   └── favicon.svg          # Honeycomb flame favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx           # Interactive event card with capacity bar
│   │   │   ├── EventDetailModal.jsx    # Full agenda, rules, and event breakdown
│   │   │   ├── Navbar.jsx              # Navigation, search, and user profile menu
│   │   │   ├── RegisterModal.jsx       # Team & RSVP modal with ticket generator
│   │   │   └── TicketPassCard.jsx      # Digital boarding pass with QR visualizer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Authentication & persistent session state
│   │   │   └── ToastContext.jsx        # Glassmorphism alert notifications
│   │   ├── pages/
│   │   │   ├── CampusBuzz.jsx          # Live pulse, department rankings & DB stats
│   │   │   ├── CampusClubs.jsx         # Campus societies directory
│   │   │   ├── CreateEvent.jsx         # Host & publish event form
│   │   │   ├── ExploreEvents.jsx       # Events discovery hub with category filters
│   │   │   ├── Login.jsx               # Sign In page with 1-click test accounts
│   │   │   ├── MyTickets.jsx           # Student pass wallet & ticket manager
│   │   │   └── Register.jsx            # Create Account with college info & MongoDB
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with JWT interceptor
│   │   ├── App.jsx                     # Router & layout orchestration
│   │   ├── index.css                   # Tailwind styles, glassmorphism, scrollbars
│   │   └── main.jsx                    # React entrypoint
│   ├── .env                            # VITE_API_URL=http://localhost:5000/api
│   ├── package.json
│   ├── tailwind.config.js              # EventHive amber & midnight theme palette
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authorization validator
│   ├── models/
│   │   ├── Event.js             # Mongoose Event schema & text indexes
│   │   ├── Registration.js      # Unique tickets & team schema
│   │   └── User.js              # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth (register, login, me, profile)
│   │   ├── clubRoutes.js        # /api/clubs (campus clubs directory)
│   │   ├── eventRoutes.js       # /api/events (CRUD, filters, stats)
│   │   └── registrationRoutes.js# /api/registrations (RSVP, my-tickets, cancel)
│   ├── seeds/
│   │   └── seedEvents.js        # Auto-seeds realistic hackathons, fests & passes
│   ├── .env                     # PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
│   ├── package.json
│   └── server.js                # Express app, MongoDB connection, CORS, API routes
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites:
- **Node.js**: v18 or higher (v20+ recommended)
- **MongoDB Community Server**: Running on port `27017`

### 2. Running the Backend Server:
```powershell
cd C:\Users\ADMIN\.gemini\antigravity\scratch\25070521343\server
npm start
```
*The server will start on `http://localhost:5000` and automatically connect to MongoDB (`eventhive`).*

### 3. Running the React Frontend Client:
In a new terminal:
```powershell
cd C:\Users\ADMIN\.gemini\antigravity\scratch\25070521343\client
npm run dev
```
*The client will start on `http://localhost:5173`.*

---

## 🔑 Demo Test Credentials

You can instantly test the platform using the built-in 1-Click buttons or these credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student Attendee** | `alex.student@college.edu` | `password123` | Alex Rivera (CS 3rd Year, Has active HackNova pass) |
| **Club Organizer** | `priya.organizer@campus.edu` | `password123` | Priya Sharma (GDSC Lead, Event Organizer) |

*(Or click **"Join Hive" / Create Account** to register a brand new student profile directly into MongoDB).*

---

## 📡 Backend API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/health` | `GET` | Public | Server uptime and MongoDB connection state |
| `/api/auth/register` | `POST` | Public | Creates student/organizer user record in MongoDB |
| `/api/auth/login` | `POST` | Public | Authenticates credentials and returns JWT token |
| `/api/auth/me` | `GET` | Private | Retrieves current authenticated profile |
| `/api/events` | `GET` | Public | Retrieves events with category, search & mode filters |
| `/api/events/featured`| `GET` | Public | Retrieves flagship highlighted events |
| `/api/events/:id` | `GET` | Public | Retrieves single event details |
| `/api/events` | `POST` | Private | Publishes a new event to MongoDB |
| `/api/events/:id` | `DELETE`| Private | Deletes an event |
| `/api/registrations/:eventId` | `POST` | Private | Confirms RSVP and creates digital ticket pass |
| `/api/registrations/my-tickets`| `GET` | Private | Lists logged-in student's passes |
| `/api/registrations/:id` | `DELETE`| Private | Cancels RSVP and frees event capacity |
| `/api/clubs` | `GET` | Public | Lists active student societies and event counts |
| `/api/events/stats/summary` | `GET` | Public | Aggregates platform participation metrics |

---

Built with ⚡ for **EventHive — College Event Platform**.

# 25070521343_CA_3
