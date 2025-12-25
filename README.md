# 🛍️ AI Support Chat – Full Stack Application

An AI-powered customer support chat application for a fictional e-commerce store.  
Built as a **full-stack project** with a modern React frontend and a TypeScript backend, integrated with a real Large Language Model (LLM) and persistent storage.

---

## 🔗 Live Demo

- **Frontend (Vercel):** https://ai-support-agent-zvxl.vercel.app/
- **Backend (Render):** https://ai-support-agent-dl3b.onrender.com

---

## 📌 Features Overview

### 💬 Chat UI (Frontend)
- Simple live chat interface
- Scrollable message list
- Clear distinction between **User** and **AI** messages
- Input box with **Send** button
- Press **Enter** to send message
- Auto-scroll to the latest message
- Disabled send button while request is in progress
- Friendly error messages on failure
- Fully responsive (mobile + desktop)
- Chat UI centered with full-screen background

---

### ⚙️ Backend API
- Implemented in **TypeScript**
- REST API endpoints:
  - `POST /chat/message`
  - `GET /chat/history/:sessionId`
- Persists all messages (user + AI)
- Messages linked to a session/conversation
- Backend never crashes on bad input
- Clean error responses returned to the frontend

---

### 🤖 LLM Integration
- Integrated with **OpenAI API**
- API key managed via environment variables
- LLM logic wrapped in a service function:
  - `generateReply(history, userMessage)`
- Prompt includes:
  - System prompt defining role as an e-commerce support agent
  - Conversation history for contextual responses
- Graceful handling of:
  - Invalid API keys
  - Rate limits
  - Timeouts
- Friendly fallback message shown to users on failure

---

### 📚 Seeded Knowledge (FAQ Handling)

The AI agent is seeded with fictional store knowledge:

- **Shipping:** Worldwide shipping in 5–7 business days
- **Returns:** 7-day return/refund policy
- **Support Hours:** Monday–Friday, 9 AM – 6 PM IST

This information is included in the system prompt so the AI can reliably answer FAQs.

---

### 🗄️ Data Model & Persistence

PostgreSQL database (Render) with the following schema:

#### Conversations
| Field | Type |
|------|------|
| id | TEXT (PK) |
| created_at | TIMESTAMP |

#### Messages
| Field | Type |
|------|------|
| id | TEXT (PK) |
| conversation_id | TEXT (FK) |
| sender | `"user"` \| `"ai"` |
| text | TEXT |
| created_at | TIMESTAMP |

**Capabilities:**
- Every message is persisted
- Messages associated with a conversation/session
- Chat history restored on reload using `sessionId`
- No authentication required (kept intentionally simple)

---

### 🛡️ Robustness & Safety
- Empty messages are rejected
- Very long messages handled safely
- Backend input validation applied
- LLM/API failures handled gracefully
- Friendly error messages displayed in UI
- No secrets committed to the repository
- Graceful failure preferred over silent failure

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- CSS (custom responsive UI)
- Deployed on **Vercel**

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL (Render)
- OpenAI API
- Deployed on **Render**

---

## 📂 Project Structure
AI-support-agent/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ └── chat.routes.ts
│ │ ├── services/
│ │ │ └── llm.service.ts
│ │ ├── db/
│ │ │ └── pool.ts
│ │ ├── app.ts
│ │ └── server.ts
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ │ └── chatApi.ts
│ │ ├── components/
│ │ │ └── Chat.tsx
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── package.json
│ └── vite.config.ts
│
└── README.md

---

## 🏃‍♂️ Running Locally (Step-by-Step)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/AI-support-agent.git
cd AI-support-agent

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend/:

OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chat
PORT=4000

🔑 Get OpenAI API Key

Visit https://platform.openai.com

Create an API key

Copy and paste it into .env

3️⃣ Database Setup (PostgreSQL)

Create database:

CREATE DATABASE ai_chat;


Create tables:

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender TEXT CHECK(sender IN ('user','ai')),
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


You can run this using:

psql

pgAdmin

Render database console

4️⃣ Start Backend Server
npm run dev


Backend runs on:

http://localhost:4000

5️⃣ Frontend Setup
cd ../frontend
npm install


Create .env inside frontend/:

VITE_API_BASE_URL=http://localhost:4000


Run frontend:

npm run dev


Frontend runs on:

http://localhost:5173

🧩 Architecture Overview
Backend Structure
src/
├── routes/        # HTTP routes (API layer)
├── services/      # Business logic (LLM integration)
├── db/            # Database connection (PostgreSQL)
├── app.ts         # Express app setup
└── server.ts      # Server entry point

Design Decisions

Routes layer handles request/response logic only

Service layer encapsulates LLM interaction

Database layer abstracts PostgreSQL connection

Clear separation improves testability and maintainability

Stateless backend; session handled via sessionId

🤖 LLM Notes

Provider: OpenAI

Model Used: gpt-4o-mini

Why OpenAI?

Stable API

High-quality conversational responses

Strong TypeScript SDK support

Prompt Strategy

System prompt defines role as an e-commerce support agent

Conversation history included for context

Max tokens capped to control cost

Error Handling

Invalid API key → friendly error message

Rate limits/timeouts → graceful fallback response

LLM failures never crash the backend

🧪 Example Test Messages

Try asking:

What is your return policy?

Do you ship internationally?

How long does shipping take?

When is customer support available?

My product arrived damaged, what should I do?

🚀 Deployment

Backend: Render (Node Web Service + PostgreSQL)

Frontend: Vercel (Vite preset)

Environment variables configured securely on both platforms

Production-ready builds with clean redeploys

📝 Notes

Authentication is intentionally omitted to keep focus on system design, LLM integration, and robustness.

The architecture is easily extensible for authentication, analytics, or admin dashboards.
