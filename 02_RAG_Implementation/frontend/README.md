# 🌸 Yomiko RAG Frontend

A kawaii AI-powered Retrieval-Augmented Generation (RAG) interface built with **React, TypeScript, Vite, and Tailwind CSS**.

This frontend provides a clean document-chat experience where users can upload PDFs, interact with an AI assistant, browse uploaded documents, and manage their workspace.

## ✨ Features

- 📄 PDF upload interface
- 💬 Real-time chat UI
- 🤖 AI assistant (Yomiko)
- 📚 Documents workspace
- 🔍 Page citation display
- 🎀 Kawaii glassmorphism design
- ⚡ Built with React + TypeScript

## 🛠 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

## 📂 Project Structure

```text
src/
├── components/
│   ├── chat/
│   ├── sidebar/
│   └── upload/
├── layouts/
├── pages/
├── services/
├── types/
├── App.tsx
└── main.tsx
```

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 🔗 Backend

This frontend communicates with the FastAPI backend running on:

```text
http://127.0.0.1:8000
```

Make sure the backend server is running before using chat or document upload features.

## 👩‍💻 Author

**Shriyut Janardan**

Built as part of the **Yomiko RAG** project.