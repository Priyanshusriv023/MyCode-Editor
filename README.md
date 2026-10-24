# VibeCode Editor

VibeCode Editor is an AI-assisted, browser-based development environment for
creating and running frontend projects without leaving the browser. It combines
a Monaco-powered editor, WebContainers, a terminal, live previews, project
management, and an AI coding assistant in one workspace.

## Features

- **In-browser development** with Monaco Editor and an integrated terminal.
- **Live project previews** powered by WebContainers.
- **AI coding assistant** with chat, code review, error fixing, and optimization
  modes.
- **AI code completion** with language and framework-aware suggestions.
- **Starter templates** for React, Next.js, Express, Vue, Hono, and Angular.
- **Project dashboard** for creating, editing, duplicating, deleting, and
  starring playgrounds.
- **Authentication** with GitHub and Google OAuth.
- **Persistent project data** stored in MongoDB through Prisma.
- **Light and dark themes** with a responsive interface.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Prisma](https://www.prisma.io/) with MongoDB
- [NextAuth.js](https://authjs.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [WebContainers](https://webcontainers.io/)
- [Ollama](https://ollama.com/) with `codellama:latest`
- [shadcn/ui](https://ui.shadcn.com/) and Lucide icons

## Requirements

- Node.js 20 or newer
- npm
- A MongoDB database
- GitHub and/or Google OAuth credentials
- [Ollama](https://ollama.com/download) with the Code Llama model for the AI
  chat feature

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/Priyanshusriv023/MyCode-Editor.git
cd code-editor
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>"

AUTH_SECRET="replace-with-a-long-random-secret"

AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
```

Use only the OAuth providers you configure. Do not commit `.env` files or
secrets to source control.

For local development, configure these callback URLs in your OAuth provider:

```text
GitHub: http://localhost:3000/api/auth/callback/github
Google: http://localhost:3000/api/auth/callback/google
```

### 3. Generate the Prisma client

```bash
npx prisma generate
npx prisma db push
```

The application uses MongoDB, so `DATABASE_URL` must point to a MongoDB
connection string. The schema is located at
[`prisma/schema.prisma`](./prisma/schema.prisma).

### 4. Configure the AI assistant

Install Ollama, then pull the model used by the chat API:

```bash
ollama pull codellama:latest
ollama serve
```

The chat endpoint expects Ollama at `http://localhost:11434`. The editor and
project features can still be explored without Ollama, but AI chat responses
will not be available.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

WebContainers require cross-origin isolation. The application configures the
required `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers
in [`next.config.ts`](./next.config.ts).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate the Prisma client |

## Project structure

```text
app/          Next.js routes, pages, and API endpoints
components/   Shared UI components
lib/          Database, templates, and utility helpers
modules/      Auth, dashboard, AI chat, playground, and WebContainer features
prisma/       MongoDB Prisma schema
public/       Static assets and starter template files
```

## API routes

- `POST /api/chat` - Generate an AI assistant response through Ollama.
- `POST /api/code-completion` - Generate context-aware code suggestions.
- `/api/auth/*` - NextAuth authentication handlers.
- `/api/template/*` - Template and playground operations.

## Deployment

This is a standard Next.js application and can be deployed to platforms such
as Vercel or any Node.js hosting provider. Before deploying:

1. Configure production `DATABASE_URL` and `AUTH_SECRET` values.
2. Add the production OAuth callback URLs to GitHub and Google.
3. Ensure the deployment can reach the Ollama service, or adapt the AI API
   integration to your hosted model provider.
4. Keep the cross-origin isolation headers enabled so WebContainers continue to
   work.

## Contributing

Contributions are welcome. Please open an issue to discuss a substantial
change before submitting a pull request.

## License

All rights reserved. This project is shared for portfolio and demonstration purposes.
