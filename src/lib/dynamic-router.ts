import { Request, Response, NextFunction } from 'express';
import { RouteManager } from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DynamicRouter {
  private routeManager: RouteManager;

  constructor() {
    this.routeManager = new RouteManager();
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const route = this.routeManager.findRoute(req.path);
      if (!route) {
        return next();
      }
      const params = this.routeManager.extractParams(route, req.path);
      req.params = { ...req.params, ...params };
      res.locals.currentPath = req.path;
      res.locals.params = params;
      try {
        let handler;
        
        let handlerPath;
        if (route.template.includes('/page')) {
          const rootDir = process.cwd();
          const distPath = path.join(rootDir, 'dist', 'site', route.template.replace('/page', '/handler') + '.js');
          handlerPath = `file://${distPath}`;
        }
        
        if (handlerPath) {
          try {
            handler = (await import(handlerPath)).default;
          } catch (error) {
            console.log(`Handler not found: ${handlerPath}`);
          }
        }
        
        if (handler) {
          const result = await handler(req, res);
          if (result && typeof result === 'object') {
            if (result.data) Object.assign(res.locals, result.data);
            if (result.metadata) res.locals.metadata = { ...res.locals.metadata, ...result.metadata };
          }
        }
        
        res.locals.layoutChain = route.layouts || [];
        
        if (route.layouts && route.layouts.length > 0) {
          res.locals.layout = route.layouts[0];
        } else {
          res.locals.layout = false;
        }
        
        res.render(route.template);
      } catch (error) {
        console.error(`Error rendering template ${route.template}:`, error);
        next();
      }
    };
  }

  public refreshRoutes() {
    this.routeManager.refreshRoutes();
  }

  public getRoutes() {
    return this.routeManager.getRoutes();
  }
}
