# Metadata Configuration

## Overview

The `metadata.ts` file provides **default site-wide metadata** for all pages in the application. It's located at `src/site/app/metadata.ts`.

## Purpose

- Defines global metadata that applies across all routes
- Provides fallback values when route-specific handlers don't override metadata
- Centralizes common SEO and social media information

## Structure

```typescript
export default {
    title: 'Express EJS Boilerplate',
    description: 'This is a sample metadata configuration for an Express EJS Boilerplate application.',
    twitterHandle: '',
}
```

## Usage

Metadata is automatically injected into `res.locals.metadata` via middleware in `app.ts`:

```typescript
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.currentPath = req.path;
    res.locals.metadata = metadata;
    next();
});
```

## Template Access

Templates can access metadata using EJS syntax:

```html
<title><%= locals.metadata?.title || 'EJS Express Boilerplate' %></title>
<meta name="description" content="<%= locals.metadata.description %>">
```

## Override Behavior

Route handlers can override metadata per-route by returning a `metadata` object:

```typescript
export default async function handler(req: Request, res: Response) {
    return {
        metadata: {
            title: 'Custom Page Title',
            description: 'Custom description'
        }
    };
}
```

The handler metadata is merged with global metadata, with handler values taking precedence.
