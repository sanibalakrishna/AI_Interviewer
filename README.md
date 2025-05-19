# NovaAI Interviewer

A full-stack application for conducting AI-powered interviews, built with React (Vite) and Node.js.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.8.1 or higher)
- MongoDB (for the backend)

## Project Structure

```
ai_interviewer/
├── client/          # React frontend
└── server/          # Node.js backend
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai_interviewer
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
pnpm install

# Create a .env file in the server directory with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GOOGLE_API_KEY=your_google_ai_api_key
# PORT=5000 (or your preferred port)

# Start the development server
pnpm dev
```

The server will start on http://localhost:5000 (or your configured port)

### 3. Frontend Setup

```bash
cd client

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The client will start on http://localhost:5173

## Available Scripts

### Backend (server/)

- `pnpm dev` - Start the development server with nodemon
- `pnpm test` - Run tests (to be implemented)

### Frontend (client/)

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview the production build
- `pnpm lint` - Run ESLint

## Features

- AI-powered interview system
- Document upload and processing
- Speech recognition
- User authentication
- Real-time interview feedback

## Tech Stack

### Frontend

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Axios
- React Speech Recognition

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Google Generative AI
- JWT Authentication
- Winston Logger
- Multer for file uploads

## Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_ai_api_key
PORT=5000
```

## License

This project is licensed under the ISC License.
