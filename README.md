# Real-Time Chat Application (Slack-like)

### Hexlet tests and linter status

[![Actions Status](https://github.com/immortal-p/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/immortal-p/frontend-project-12/actions)

### Demo

[https://frontend-project-12-ndyp.onrender.com](https://frontend-project-12-ndyp.onrender.com)

---

## Overview

This project is a real-time chat application similar to Slack, built with modern technologies and WebSocket communication (Socket.IO). It supports channels, instant messaging, and dynamic updates for all connected users.

---

## Features

* 🔥 Real-time messaging via Socket.IO
* 📡 Automatic UI updates without page reloads
* ➕ Create, rename, and delete channels
* 🔄 Auto-redirect to *General* if the current channel is deleted
* 🟢 Online users supported
* 🧼 Linting and automated tests via Hexlet GitHub Actions

---

## Requirements

Before installation, make sure you have:

* **Node.js** (v16 or higher)
* **npm** or **yarn**
* **Make** (for running scripts)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/immortal-p/frontend-project-12.git
   cd frontend-project-12
   ```

2. Install dependencies:

   ```bash
   make install
   ```

---

## Running the Project

### Start the backend

```bash
make start
```

### Start the frontend

```bash
make dev
```

Your chat will be available at:
👉 **[http://localhost:5002](http://localhost:5002)**

---

## How the Chat Works

After launching the project:

1. The user enters a username or logs in.
2. The chat interface loads with the default **General** channel.
3. When a user sends a message:
   * It is transmitted to the backend via **WebSocket**.
   * The backend broadcasts it to all connected clients.
   * All users see updates instantly.
4. Users can switch between channels.
5. Each user is subscribed to the selected room.
6. If a channel is deleted, users in that channel are redirected to **General**.

---

## Testing & Linting

Run linter:

```bash
make lint
```

Run tests:

```bash
make test
```

---

## Tech Stack

* **Frontend:** React, Redux Toolkit, Bootstrap, i18next
* **Real-time:** Socket.IO
* **Build tools:** Webpack, Make
* **Deployment:** Render

---

## Project Structure

```
frontend-project-12/
├── frontend/       # Client-side code
├── Makefile        # Scripts for install/start/dev
└── README.md
```
