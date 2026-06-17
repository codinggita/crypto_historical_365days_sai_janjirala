# MERN Stack Backend Project

A beginner-friendly **MERN** (MongoDB, Express, React, Node.js) project starter. This repository currently includes the **backend setup** only: folder structure, Express server, and MongoDB connection. APIs, schemas, and authentication will be added in later steps.

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Runtime      | Node.js                             |
| Backend      | Express.js                          |
| Database     | MongoDB                             |
| ODM          | Mongoose                            |
| Frontend     | React.js *(planned — not yet built)* |
| Auth         | JWT *(planned — not yet built)*     |
| Config       | dotenv                              |
| Dev tools    | nodemon, cors                       |

## Folder Structure

```
crypto/                          # Project root
├── README.md                    # This file — project documentation
├── backend/                     # Node.js + Express API server
│   ├── config/
│   │   └── db.js                # MongoDB connection logic (mongoose.connect)
│   ├── controllers/             # Handle HTTP request/response (MVC — empty for now)
│   ├── models/                  # Mongoose schemas for MongoDB collections (empty)
│   ├── routes/                  # Define API URLs and link to controllers (empty)
│   ├── middlewares/             # Auth, errors, logging between request and route (empty)
│   ├── services/                # Business logic separate from controllers (empty)
│   ├── utils/                   # Small helper functions (empty)
│   ├── .env                     # Secret/config values (not committed to Git)
│   ├── .gitignore               # Tells Git to ignore node_modules and .env
│   ├── package.json             # Project metadata and npm scripts
│   └── index.js                 # Main entry — starts Express and connects DB
└── frontend/                    # React app placeholder (empty — build later)
```

## Getting Started

Follow these steps to run the backend on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a MongoDB Atlas connection string

### Setup

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd crypto
   ```

2. **Go into the backend folder**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create your `.env` file from the example**  
   Git does **not** upload `.env` (secrets stay local). Copy the example file, then edit if needed:
   ```bash
   # Windows (PowerShell) — from the backend folder:
   copy .env.example .env
   ```
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/myproject
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Test the server**  
   Open a browser or Postman and visit: `http://localhost:5000/`  
   You should see: `{ "message": "Server is running!" }`  
   In the terminal you should see `MongoDB Connected Successfully` if MongoDB is running.

## Available Scripts

Run these from the `backend/` folder:

| Script        | Command           | Description                                      |
| ------------- | ----------------- | ------------------------------------------------ |
| `npm run dev` | `nodemon index.js` | Starts server with **nodemon** (auto-restart on file changes) |
| `npm start`   | `node index.js`    | Starts server normally (no auto-restart)         |

## Environment Variables

| Variable     | Description                                      | Example value                              |
| ------------ | ------------------------------------------------ | ------------------------------------------ |
| `PORT`       | Port number the Express server listens on        | `5000`                                     |
| `MONGO_URI`  | MongoDB connection string                        | `mongodb://localhost:27017/myproject`      |
| `JWT_SECRET` | Secret key for signing JWT tokens *(used later)* | `your_jwt_secret_key_here`                 |

> **Note:** Never commit `.env` to Git. Use `.gitignore` and share only example variable names in documentation.

## API Endpoints (Coming Soon)

| Method | Endpoint | Description        | Status   |
| ------ | -------- | ------------------ | -------- |
| GET    | `/`      | Health/test route  | ✅ Live  |

More CRUD and auth endpoints will be documented here as they are built.

## Project Checklist Progress

- [x] Project Setup & Structure
- [x] MongoDB Connection
- [ ] Schema Design
- [ ] CRUD Operations
- [ ] Advanced Querying
- [ ] Authentication (JWT)
- [ ] Middleware System
- [ ] Error Handling
- [ ] Aggregation Pipeline
- [ ] API Documentation (Postman)

## Pushing to GitHub (what gets uploaded)

Git **cannot** store truly empty folders. Each empty MVC folder includes a **`.gitkeep`** file so the folder structure appears on GitHub after you push.

| Included on GitHub | Not uploaded (on purpose) |
| ------------------ | ------------------------- |
| All source code (`index.js`, `config/db.js`, etc.) | `node_modules/` — run `npm install` after clone |
| Empty folders (via `.gitkeep` files) | `.env` — copy from `.env.example` locally |
| `package.json`, `package-lock.json` | |
| `.env.example` (safe template) | |
| `README.md`, `frontend/`, `crypto_historical_365days_sai_janjirala/` | |

**First-time push (from project root):**
```bash
git add .
git commit -m "Initial MERN backend setup with folder structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Author

[Sai Janjirala]
