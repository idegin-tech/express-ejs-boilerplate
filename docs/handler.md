# Route Handlers

## Overview

Route handlers are TypeScript files named `handler.ts` that sit alongside `page.ejs` files to inject dynamic data and metadata into templates.

## Location Convention

Handlers follow the same directory structure as pages:

```
src/site/app/
  services/
    handler.ts          # Handles /services
    page.ejs
    [slug]/
      handler.ts        # Handles /services/:slug
      page.ejs
```

## Handler Function Signature

```typescript
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    // Your logic here
    return {
        data: {
            // Data to inject into template
        },
        metadata: {
            // Override global metadata
        }
    };
}
```

## How It Works

1. The `DynamicRouter` middleware finds the route's `page.ejs` template
2. It constructs the handler path by replacing `/page` with `/handler`
3. If the handler exists, it imports and executes it
4. Returned `data` is merged into `res.locals` via `Object.assign(res.locals, result.data)`
5. Returned `metadata` is merged with global metadata, with handler values overriding
6. The template is rendered with injected data

## Example Handler

```typescript
// src/site/app/services/handler.ts
import { Request, Response } from 'express';
import { getServices } from '../../__mock__/services.js';

export default async function handler(req: Request, res: Response) {
    const services = await getServices();
    
    return {
        data: {
            services
        },
        metadata: {
            title: 'Our Services',
            description: 'Explore our professional services'
        }
    };
}
```

## Accessing Data in Templates

Data from handlers is available via `locals`:

```html
<!-- page.ejs -->
<% if (locals.services) { %>
  <% locals.services.forEach(service => { %>
    <h3><%= service.title %></h3>
  <% }) %>
<% } %>
```

## Dynamic Routes

Handlers for dynamic routes receive params:

```typescript
// src/site/app/services/[slug]/handler.ts
export default async function handler(req: Request, res: Response) {
    const { slug } = req.params;
    const service = await getServiceBySlug(slug);
    
    return {
        data: { service },
        metadata: {
            title: service.title
        }
    };
}
```

## Optional Handlers

Handlers are **optional**. If no handler exists, the page renders with only global metadata and data from middleware.
