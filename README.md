
# Ejs Express Boilerplate

Ejs Express Boilerplate is a modern Express.js starter template using EJS, Bootstrap, and TypeScript. It features dynamic routing, layout support, and a clean project structure for rapid web development.

## Features

- Express.js with TypeScript
- EJS templating with layouts
- Dynamic file-based routing
- Metadata and SEO support
- Easy asset management (images, CSS, fonts, etc.)

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd express-ejs-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot-reloading:

```bash
npm run dev
```

The app will compile TypeScript files and start the server. By default, it runs on [http://localhost:8080](http://localhost:8080).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server entry point
│   ├── lib/                  # Routing and utilities
│   ├── types/                # TypeScript types
│   └── site/
│       ├── app/              # Page routes (file-based routing)
│       │   ├── index.ejs     # Home page
│       │   ├── about-us/     # About page
│       │   ├── blog/         # Blog pages
│       │   ├── services/     # Services pages
│       │   └── ...
│       ├── components/       # EJS partials (header, footer, etc.)
│       ├── layout/           # Layout templates (default.ejs)
│       └── public/           # Static assets (images, css, fonts, etc.)
├── package.json
├── tsconfig.json
├── Dockerfile
└── fly.toml
```

### Key Directories

- **src/site/app/**: All route pages. Each folder or file represents a route. Dynamic routes use `[param]` syntax.
- **src/site/components/**: EJS partials for reuse (header, footer, etc).
- **src/site/layout/**: Layout templates. The default layout is `default.ejs`.
- **src/site/public/**: Place all static assets here (images, CSS, fonts, etc). These are served at the root URL (e.g., `/image.jpg`).

## Data Fetching, Injection, and Metadata

- Each route can have an optional `handler.ts` file alongside its `page.ejs`.
- Data fetching, injection, and metadata manipulation for a route happen in its `handler.ts`.
- The handler returns data and metadata, which are injected into the EJS template.

Example:

```
src/site/app/services/handler.ts
src/site/app/services/page.ejs
```

## Adding Assets

- Add images, CSS, fonts, and other static files to `src/site/public/`.
- Reference them in your EJS templates using `/filename.ext` (e.g., `/image.jpg`, `/styles.css`).

## Customizing Layout

- The default layout is in `src/site/layout/default.ejs`.
- You can create additional layouts as needed and set them per route.

## Environment Variables

Set environment variables in a `.env` file at the project root. Example:

```
PORT=8080
NODE_ENV=development
```

## Deployment

Build and start the app for production:

```bash
npm run build
npm start
```

For deployment on Fly.io, see `fly.toml` for configuration.

## Documentation

For detailed documentation on core concepts, see the [docs folder](./docs/table-of-content.md):

- [Metadata Configuration](./docs/metadata.md)
- [Route Handlers](./docs/handler.md)
- [Dynamic Page Routes](./docs/dynamic-routes.md)

## License

MIT
