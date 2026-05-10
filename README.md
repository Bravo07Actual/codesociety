# CodeSociety

A LeetCode-style competitive coding platform where users can solve problems, run code in-browser, and compete on a leaderboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, CodeMirror |
| Backend | Node.js, Express, MongoDB (Atlas) |
| Auth | JWT via httpOnly cookies |
| Execution | Custom code execution worker (Python, C++, Java) |

## Services

- **codesociety-client** — React frontend (`localhost:5173`)
- **codesociety-server** — REST API server (`localhost:8000`)
- **codesociety-worker** — Code execution engine (`localhost:8002`)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3, g++/clang++, Java 17 (for code execution)
- MongoDB Atlas account

### Setup

```bash
# Clone the repo
git clone https://github.com/Bravo07Actual/codesociety.git
cd codesociety

# Install dependencies for each service
cd codesociety-server && npm install
cd ../codesociety-client && npm install
cd ../codesociety-worker && npm install
```

Create a `.env` file in `codesociety-server/`:
```
PORT=8000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running Locally

```bash
# Terminal 1 — Backend
cd codesociety-server && node server.js

# Terminal 2 — Execution worker
cd codesociety-worker && node index.js

# Terminal 3 — Frontend
cd codesociety-client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

- **Problems** — Browse, filter, and solve coding problems by difficulty and tags
- **In-browser Editor** — CodeMirror editor with syntax highlighting for C++, Java, Python
- **Run Code** — Executes against sample testcases and shows pass/fail per case
- **Submit** — Saves submission to DB with verdict tracking
- **Playground** — Free-form code editor with custom input
- **Auth** — Register, login, protected routes
- **Leaderboard** — CodeAura-based rankings *(in progress)*

## Project Status

| Feature | Status |
|---|---|
| Auth (register/login/logout) | ✅ Done |
| Problems CRUD (admin) | ✅ Done |
| Code execution (run) | ✅ Done |
| Submission storage | ✅ Done |
| Verdict engine (accept/reject) | 🔧 In progress |
| CodeAura scoring | 🔧 In progress |
| Leaderboard | 🔧 In progress |

## Branch Strategy

`develop` is the active development branch. `main` is reserved for stable releases. All PRs should target `develop`.
