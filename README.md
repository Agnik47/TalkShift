# 🚀 TalkShift

### Real-Time Group Chat Application with AI-Powered Summaries

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?logo=socket.io)
![AI](https://img.shields.io/badge/AI-Groq%20LLM-purple)

---

## 📌 Overview

**TalkShift** is a modern real-time group chat platform built with the **MERN Stack** and **WebSockets (Socket.IO)**.
It enables users to communicate instantly in groups, see online members, and collaborate seamlessly.

A unique feature of TalkShift is its **AI-powered conversation summary**, which allows users to generate a concise summary of the recent discussion using a simple command.

---

## ✨ Features

### 💬 Real-Time Messaging

* Instant group chat using **Socket.IO**
* Live message updates without refreshing
* Typing indicators
* Online user presence

### 👥 Group Management

* Create and join chat groups
* View group members
* Invite users via group code
* Admin controls for group management

### 🔐 Authentication & Security

* Secure login and registration
* **JWT-based authentication**
* Password encryption using **bcrypt**

### 🤖 AI Chat Assistant

Generate quick conversation summaries using:

```
/summary
```

or

```
\summary
```

The AI analyzes the **last 10 messages** in the chat and produces a simple summary of the discussion.

Example:

> *Agnik and Rohit discussed the upcoming Plutonia exhibition scheduled for February 19 and decided to collaborate on it.*

---

## 🧠 How AI Summary Works

1. User types `/summary`
2. Frontend sends request to backend API
3. Backend retrieves the last **10 messages**
4. Messages are sent to **Groq LLM**
5. AI generates a concise summary
6. Summary is displayed in chat as **AI Assistant**

---

## 🏗️ Project Architecture

```
Client (React + Vite)
        ↓
Socket.IO Connection
        ↓
Express.js Backend
        ↓
MongoDB Database
```

---

## 🗂️ Folder Structure

```
ChatApp/
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatArea.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UsersList.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/                 # Backend (Node + Express)
│   ├── middleware/
│   ├── models/
│   │   ├── UserModel.js
│   │   ├── GroupModel.js
│   │   └── ChatModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── messageRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   └── aiService.js
│   ├── socket.js
│   └── server.js
```

---

## ⚙️ Technologies Used

### Frontend

* React
* Vite
* Chakra UI
* Tailwind CSS
* Axios
* Framer Motion

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose

### AI Integration

* Groq LLM API
* LLaMA Model

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/talkshift.git
cd talkshift
```

---

### 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 4️⃣ Setup Environment Variables

Create `.env` inside **server/**

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
```

Create `.env` inside **client/**

```
VITE_API_URL=http://localhost:5000
```

---

### 5️⃣ Run the Application

Start backend:

```bash
cd server
npm start
```

Start frontend:

```bash
cd client
npm run dev
```

---

## 📷 Screenshots

*(Add screenshots here for better presentation)*

* Login Page
* Group Chat Interface
* AI Summary Feature

---

## 🔮 Future Enhancements

* Message reactions
* File & image sharing
* Voice messages
* Chat search
* Dark mode
* AI auto moderation
* AI translation

---

## 👨‍💻 Author

**Agnik Paul**

Frontend Developer | MERN Stack Enthusiast

---

## ⭐ Support

If you like this project, please **star the repository** ⭐

It motivates me to build more cool projects.
