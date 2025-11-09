import app from './app.js';
import { createLiveReloadServer } from './lib/livereload.js';

const port = Number(process.env.PORT) || 8080;

if (process.env.NODE_ENV === 'development') {
  createLiveReloadServer();
}

app.listen(port, '0.0.0.0', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${port}`);
  }
});
