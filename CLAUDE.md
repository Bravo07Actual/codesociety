# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CodeSociety is a LeetCode-style competitive coding platform with three independent services:

| Service | Port | Stack |
|---|---|---|
| `codesociety-client` | 5173 | React 19, Vite, Tailwind CSS, CodeMirror |
| `codesociety-server` | 8000 | Express (ESM), MongoDB/Mongoose, JWT cookies |
| `codesociety-worker` | 8002 | Node.js HTTP execution server (Python, C++, Java) |

## Running the Project

```bash
# Server
cd codesociety-server && node server.js

# Worker (execution engine)
cd codesociety-worker && node index.js

# Client
cd codesociety-client && npm run dev
```

## Branch Strategy

`develop` is the working branch — **not `main`**. `main` only has the initial backend commit. Always branch from and PR into `develop`.

## Architecture

### Auth Flow
JWT stored in httpOnly cookies (set by server). `AuthContext` mirrors user data in `localStorage` for frontend state. `PrivateRoute` guards protected pages; `GuestRoute` blocks logged-in users from `/login` and `/register`.

### HTTP Calls
All server (port 8000) calls use `axiosInstance` from `src/utils/axios.js` — it has `baseURL` and `withCredentials` pre-configured. Raw `axios` is only used for worker calls (port 8002).

### Submission Flow (current state)
Submit → saved to MongoDB as `Pending` → stays `Pending` forever. The RabbitMQ verdict pipeline is **not yet built**. `amqplib` is installed in both server and worker but not wired up.

### Code Execution Worker
Writes code to a temp file, compiles if needed, runs with input piped from stdin, returns stdout/stderr. **C++ requires a special include path on macOS:**
```
clang++ -I/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk/usr/include/c++/v1
```
This is hardcoded in `codesociety-worker/index.js` and is machine-specific.

### Problem Testcase Format
Testcase `input` fields must be **stdin format** (actual values, not descriptive). Example for Two Sum: `2 7 11 15\n9`, not `nums = [2,7,11,15], target = 9`. Expected `output` must match exactly what the program prints (e.g. Python's `[0, 1]` not `[0,1]`).

### Database
MongoDB Atlas (cloud). URI in `codesociety-server/.env`. If the cluster is unresponsive, log in to cloud.mongodb.com and check if `Cluster0` is paused — resume it if so.

### Admin Accounts
Registration always creates `role: "user"`. To make an admin, update directly in MongoDB:
```js
await User.findOneAndUpdate({ email: 'your@email.com' }, { role: 'admin' });
```
Only admins can create/update/delete problems (`verifyAdmin` middleware).

## What's Not Built Yet

- **Verdict engine** — RabbitMQ queue between server and worker, hidden testcase evaluation, submission status updates
- **CodeAura scoring** — No `codeAura` field on User model; Navbar shows hardcoded `0`
- **Leaderboard** — Currently hardcoded mock data
- **Solved status** — ProblemsList always shows "Unsolved"; needs check against accepted submissions
- **docker-compose** — File exists but is empty
