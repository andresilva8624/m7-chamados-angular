import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const envAllowedHosts = (process.env['ALLOWED_HOSTS'] ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const renderHostname = process.env['RENDER_EXTERNAL_HOSTNAME'];
const renderServiceName = process.env['RENDER_SERVICE_NAME'];
const allowedHosts = Array.from(
  new Set([
    'localhost',
    '127.0.0.1',
    '::1',
    '*.onrender.com',
    '.onrender.com',
    renderHostname,
    renderServiceName ? `${renderServiceName}.onrender.com` : undefined,
    ...envAllowedHosts,
  ].filter((host): host is string => Boolean(host))),
);

const app = express();
app.set('trust proxy', true);

const angularApp = new AngularNodeAppEngine({
  allowedHosts,
  trustProxyHeaders: ['x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port'],
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Explicit root redirect for Render and browsers that hit the bare domain.
 */
app.get('/', (req, res) => {
  res.redirect('/chamados');
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] ?? 4000);

  app.listen(port, '0.0.0.0', (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://0.0.0.0:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
