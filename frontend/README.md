# Article Web Application

A web application for creating, managing, and viewing articles.

The application provides a dashboard for managing article statuses and a public-style preview for published articles.

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React
* REST API

## Features

* Article dashboard
* Published, Draft, and Trashed tabs
* Create new articles
* Edit existing articles
* Move articles to trash
* Publish or save articles as drafts
* Article preview
* Pagination
* Responsive interface
* REST API integration

## Project Structure

```text
frontend/
├── app/
│   ├── add-new/
│   │   └── page.tsx
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── preview/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── api.ts
├── public/
├── .env.local
├── package.json
├── package-lock.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Requirements

Make sure the following are installed:

* Node.js
* npm

## Installation

Clone the repository:

```bash
git clone https://github.com/KevinAxelN/article-web-application.git
```

Navigate to the frontend:

```bash
cd article-web-application/frontend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file inside the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

This variable points the frontend to the backend API.

For a deployed environment, replace the value with the deployed backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Do not commit `.env.local` to Git.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend requires the backend API to be running.

## Available Pages

| Page         | Description                  |
| ------------ | ---------------------------- |
| `/`          | Article management dashboard |
| `/add-new`   | Create a new article         |
| `/edit/{id}` | Edit an existing article     |
| `/preview`   | Preview published articles   |

## Article Management

### Published

Displays articles with `publish` status.

### Drafts

Displays articles with `draft` status.

### Trashed

Displays articles with `thrash` status.

Articles can be edited from the dashboard, while active articles can be moved to the trash.

## API Integration

The frontend communicates with the backend through REST API endpoints.

The API base URL is configured using:

```env
NEXT_PUBLIC_API_URL
```

Example:

```text
Frontend
   │
   │ REST API
   ▼
Backend API
   │
   ▼
MySQL / TiDB
```

## Build for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment

The frontend can be deployed using Vercel.

Recommended configuration for this monorepo:

```text
Root Directory: frontend
Framework: Next.js
```

Set the following environment variable in the hosting platform:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

After deployment, the application can communicate with the deployed backend API through this environment variable.
