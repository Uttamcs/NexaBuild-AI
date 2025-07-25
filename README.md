# NexaBuild-AI

An AI-powered website generator that creates complete, functional websites from text descriptions.

## Features

- Generate complete websites (HTML, CSS, JavaScript) from text descriptions
- Web interface with live preview
- Open generated websites in a new tab
- Copy HTML, CSS, and JavaScript code
- Powered by Google's Gemini AI

## Project Structure

The project is organized into two main directories:

- `frontend`: Contains the web interface
- `backend`: Contains the API server that communicates with the AI

## Installation

1. Clone this repository
2. Install dependencies for all components:
   ```
   npm run install:all
   ```
3. Create a `.env` file in the `backend` directory with your Google AI API key:
   ```
   API_KEY=your_google_ai_api_key_here
   ```

## Usage

### Start both frontend and backend servers

```
npm start
```

This will start:
- Backend API server on http://localhost:5000
- Frontend server on http://localhost:3000

### Start only the backend

```
npm run start:backend
```

### Start only the frontend

```
npm run start:frontend
```

## How It Works

1. Enter a description of the website you want to create in the web interface
2. The frontend sends the description to the backend API
3. The backend uses Google's Gemini AI to generate HTML, CSS, and JavaScript code
4. The generated code is returned to the frontend and displayed
5. You can preview the website, open it in a new tab, or copy the code

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI: Google Gemini AI