# TaskFlow — MERN Task Tracker

A full-stack Task Tracker web application built with the MERN stack (MongoDB, Express, React, Node.js).

![TaskFlow](https://img.shields.io/badge/Stack-MERN-6366f1?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)

---

## Features

### Mandatory
- ✅ **Full CRUD** — Create, View, Update, Delete tasks
- ✅ **Form Validation** — Frontend + backend validation with error messages
- ✅ **REST API** — Clean RESTful endpoints with proper HTTP methods
- ✅ **MongoDB Integration** — Mongoose schemas with indexes
- ✅ **Responsive UI** — Works on mobile, tablet, and desktop
- ✅ **Dynamic Updates** — No page refresh needed (React state + Context API)
- ✅ **Deployable** — Ready for Vercel (frontend) + Render (backend)

### Bonus
- ⭐ **Filter** by status and priority
- ⭐ **Sort** by date created, due date, title, or priority (asc/desc)
- ⭐ **Search** tasks with debounce
- ⭐ **Toast Notifications** for all actions
- ⭐ **Overdue Detection** — Pulse animation on overdue tasks
- ⭐ **Tags** — Comma-separated tags per task
- ⭐ **Progress Bar** — Completion percentage in sidebar
- ⭐ **Environment Variables** — `.env.example` for both services
- ⭐ **Reusable Components** — TaskCard, TaskModal, Sidebar

---

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, axios, date-fns, react-hot-toast |
| Backend   | Node.js, Express 4, Mongoose      |
| Database  | MongoDB Atlas                     |
| Deploy    | Vercel (FE) + Render (BE)         |

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── controllers/
│   │   └── taskController.js    # All CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   └── Task.js              # Mongoose schema
│   ├── routes/
│   │   └── tasks.js             # Express routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.jsx     # Individual task display
    │   │   ├── TaskModal.jsx    # Create/edit form modal
    │   │   └── Sidebar.jsx      # Filters, sort, stats
    │   ├── context/
    │   │   └── TaskContext.jsx  # Global state management
    │   ├── utils/
    │   │   └── api.js           # Axios API layer
    │   ├── App.jsx              # Root component
    │   ├── index.css            # Design system / global styles
    │   └── main.jsx             # React entry point
    ├── .env.example
    ├── index.html
    └── vite.config.js
```

---

## API Endpoints

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/tasks`           | Get all tasks (with filters)   |
| GET    | `/api/tasks/:id`       | Get single task                |
| POST   | `/api/tasks`           | Create a task                  |
| PUT    | `/api/tasks/:id`       | Update a task                  |
| DELETE | `/api/tasks/:id`       | Delete a task                  |
| PATCH  | `/api/tasks/:id/status`| Quick status update            |

### Query Parameters (GET /api/tasks)
- `status` — `todo` | `in-progress` | `done`
- `priority` — `low` | `medium` | `high`
- `sort` — `createdAt` | `dueDate` | `title` | `priority`
- `order` — `asc` | `desc`
- `search` — search by title or description

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MONGODB_URI
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm run dev
# App runs on http://localhost:5173
```

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory**: `backend`
4. **Build command**: `npm install`
5. **Start command**: `npm start`
6. Add environment variables: `MONGODB_URI`, `FRONTEND_URL`, `NODE_ENV=production`

### Frontend → Vercel
1. Import project from GitHub on [vercel.com](https://vercel.com)
2. Set **Root Directory**: `frontend`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## Task Schema

```js
{
  title:       String (required, 3–100 chars),
  description: String (max 500 chars),
  status:      "todo" | "in-progress" | "done",
  priority:    "low" | "medium" | "high",
  dueDate:     Date (optional),
  tags:        [String],
  createdAt:   Date (auto),
  updatedAt:   Date (auto),
}
```

---

## Author

Built by **Vansh** for COLL-EDGE CONNECT Technical Assignment.
