# Dynamic Page Routes

## Overview

The boilerplate uses a file-system based routing system where directory structure automatically defines routes. The `RouteManager` scans `src/site/app/` to discover routes.

## Route Discovery

Routes are created by placing `page.ejs` files in directories:

```
src/site/app/
  page.ejs              # Route: /
  about-us/
    page.ejs            # Route: /about-us
  services/
    page.ejs            # Route: /services
    [slug]/
      page.ejs          # Route: /services/:slug (dynamic)
```

## Static Routes

Directories with regular names create static routes:

- `about-us/page.ejs` → `/about-us`
- `contact-us/page.ejs` → `/contact-us`
- `services/page.ejs` → `/services`

## Dynamic Routes

Directories wrapped in brackets `[param]` create dynamic routes with parameters:

- `services/[slug]/page.ejs` → `/services/:slug`
- `blog/[id]/page.ejs` → `/blog/:id`

The parameter name matches the directory name without brackets.

## Route Scanning Process

1. **Initialization**: `RouteManager` scans `src/site/app/` on startup
2. **Directory Traversal**: Recursively walks through directories
3. **Page Detection**: Looks for `page.ejs` files
4. **Route Creation**: Builds route patterns from directory path

### Code Flow

```typescript
// routes.ts
private scanDirectory(dirPath: string, pathSegments: string[]) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
        if (item.isDirectory()) {
            this.scanDirectory(
                path.join(dirPath, item.name),
                [...pathSegments, item.name]
            );
        } else if (item.name === 'page.ejs') {
            const route = this.createRoute(pathSegments);
            this.routes.push(route);
        }
    }
}
```

## Route Matching

The `DynamicRouter` middleware matches incoming requests to routes:

```typescript
public findRoute(requestPath: string): Route | null {
    const normalizedPath = requestPath === '/' ? '/' : requestPath.replace(/\/$/, '');
    
    for (const route of this.routes) {
        if (!route.isDynamic && route.pattern === normalizedPath) {
            return route;
        }
        if (route.isDynamic) {
            const regex = this.createRouteRegex(route.pattern);
            if (regex.test(normalizedPath)) {
                return route;
            }
        }
    }
    return null;
}
```

## Parameter Extraction

Dynamic route parameters are extracted and added to `req.params`:

```typescript
// For route pattern: /services/:slug
// Request: /services/web-development

extractParams(route, '/services/web-development')
// Returns: { slug: 'web-development' }
```

Parameters are available in:
- `req.params.slug` (Express)
- `res.locals.params.slug` (Templates)

## Template Resolution

The router maps routes to templates:

```typescript
private createRoute(pathSegments: string[]): Route {
    const templatePath = segments.length > 0 
        ? `app/${segments.join('/')}/page` 
        : 'app/page';
    // ...
}
```

Examples:
- `['services']` → `app/services/page`
- `['services', '[slug]']` → `app/services/[slug]/page`
- `[]` → `app/page` (root)

## Route Refresh

Routes can be refreshed without restarting:

```typescript
const router = new DynamicRouter();
router.refreshRoutes(); // Re-scans directories
```

## Viewing Routes

Use the route utility to see all discovered routes:

```typescript
import { logRoutes } from './lib/route-utils.js';

logRoutes();
```

Output:
```
=== Available Routes ===
STATIC  /                              -> app/page
STATIC  /about-us                      -> app/about-us/page
STATIC  /services                      -> app/services/page
DYNAMIC /services/:slug                -> app/services/[slug]/page
========================
```
