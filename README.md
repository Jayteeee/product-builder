# Lunch Menu Recommender & RPS Game

A comprehensive lunch menu recommendation app powered by Google Gemini AI, featuring a fun Rock-Paper-Scissors game.

## Features

- **AI Menu Recommendation**: Get personalized lunch suggestions based on category, price, and spice level.
- **Image Search**: Fetches real food images using Google Custom Search and Pexels APIs.
- **RPS Game**: A fully interactive Rock-Paper-Scissors game using TensorFlow.js and Teachable Machine.
- **Theme & Language**: Supports Dark/Light modes and English/Korean languages.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **AI**: Google Gemini Pro, TensorFlow.js
- **Deployment**: Cloudflare Pages

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   - `VITE_GEMINI_API_KEY`
   - `VITE_GOOGLE_API_KEY`
   - `VITE_GOOGLE_SEARCH_ENGINE_ID`
   - `VITE_PEXELS_API_KEY`
4. Run locally: `npm run dev`
