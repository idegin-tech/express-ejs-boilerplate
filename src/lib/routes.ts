import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Route {
  pattern: string;
  template: string;
  isDynamic: boolean;
  segments: string[];
  layouts: string[];
}

export class RouteManager {
  private routes: Route[] = [];
  private appDir: string;

  constructor() {
    const currentDir = process.cwd();
    this.appDir = path.join(currentDir, 'src', 'site', 'app');
    this.scanRoutes();
  }

  private scanRoutes() {
    this.routes = [];
    this.scanDirectory(this.appDir, []);
  }

  private scanDirectory(dirPath: string, pathSegments: string[]) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (item.name === 'page.ejs') {
        const route = this.createRoute(pathSegments);
        this.routes.push(route);
      } else if (item.name === 'index.ejs') {
        const route = this.createRoute([]);
        this.routes.push(route);
      } else if (item.isDirectory()) {
        this.scanDirectory(
          path.join(dirPath, item.name),
          [...pathSegments, item.name]
        );
      }
    }
  }

  private createRoute(pathSegments: string[]): Route {
    const segments = pathSegments.filter(segment => segment !== '');
    const isDynamic = segments.some(segment => segment.startsWith('[') && segment.endsWith(']'));
    
    let pattern = '/' + segments.join('/');
    if (segments.length === 0) pattern = '/';
    
    const templatePath = segments.length > 0 
      ? `app/${segments.join('/')}/page` 
      : 'app/page';

    if (isDynamic) {
      pattern = '/' + segments.map(segment => {
        if (segment.startsWith('[') && segment.endsWith(']')) {
          return ':' + segment.slice(1, -1);
        }
        return segment;
      }).join('/');
    }

    const layouts = this.findLayouts(segments);

    return {
      pattern,
      template: templatePath,
      isDynamic,
      segments,
      layouts
    };
  }

  private findLayouts(segments: string[]): string[] {
    const layouts: string[] = [];
    
    const rootLayoutPath = path.join(this.appDir, 'layout.ejs');
    if (fs.existsSync(rootLayoutPath)) {
      layouts.push('app/layout');
    }
    
    for (let i = 1; i <= segments.length; i++) {
      const segmentPath = segments.slice(0, i);
      const layoutPath = path.join(this.appDir, ...segmentPath, 'layout.ejs');
      if (fs.existsSync(layoutPath)) {
        layouts.push(`app/${segmentPath.join('/')}/layout`);
      }
    }
    
    return layouts;
  }

  public getRoutes(): Route[] {
    return this.routes;
  }

  public findRoute(requestPath: string): Route | null {
    const normalizedPath = requestPath === '/' ? '/' : requestPath.replace(/\/$/, '');
    
    for (const route of this.routes) {
      if (route.pattern === normalizedPath) {
        return route;
      }
      
      if (route.isDynamic) {
        const routeRegex = this.createRouteRegex(route.pattern);
        if (routeRegex.test(normalizedPath)) {
          return route;
        }
      }
    }
    
    return null;
  }

  private createRouteRegex(pattern: string): RegExp {
    const regexPattern = pattern.replace(/:([^/]+)/g, '([^/]+)');
    return new RegExp(`^${regexPattern}$`);
  }

  public extractParams(route: Route, requestPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    if (!route.isDynamic) return params;

    const routeRegex = this.createRouteRegex(route.pattern);
    const match = requestPath.match(routeRegex);
    
    if (match) {
      const paramNames = route.pattern.match(/:([^/]+)/g);
      if (paramNames) {
        paramNames.forEach((paramName, index) => {
          const key = paramName.slice(1);
          params[key] = match[index + 1];
        });
      }
    }
    
    return params;
  }

  public refreshRoutes() {
    this.scanRoutes();
  }
}
