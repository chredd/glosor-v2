# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Glosor v2 - React app for practicing English vocabulary. Built with Vite, TypeScript, and Tailwind CSS. Hosted on GitHub Pages.

Vocabulary data is fetched from a published Google Sheet (CSV format).

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Architecture

```
src/
├── components/      # React components
│   ├── Quiz.tsx     # Quiz container with state management
│   ├── QuizCard.tsx # Single word card with input/correction
│   ├── Result.tsx   # Summary table after completion
│   ├── Snowflakes.tsx # Celebration animation
│   └── Loading.tsx
├── hooks/
│   ├── useVocabulary.ts # Fetches and parses CSV from Google Sheets
│   └── useSpeech.ts     # Web Speech API wrapper (sv-SE, en-GB)
├── types/           # TypeScript interfaces
└── utils/
    └── csv.ts       # CSV parsing and shuffle utility
```

## Data Source

The vocabulary is loaded from a Google Sheet published as CSV. The sheet has two columns: `English | Swedish` (no header row).

URL is configured in `src/hooks/useVocabulary.ts`.

## Deployment

Push to `main` branch triggers GitHub Actions workflow that builds and deploys to GitHub Pages. The app is served from `/glosor-v2/` base path.
