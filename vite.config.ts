import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    root: 'project',
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    plugins: [
      {
        name: 'clean-urls-and-redirects',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url) return next();
            const [pathname, search] = req.url.split('?');
            const query = search ? `?${search}` : '';

            // Permanent 301 Redirects for explicit .html URLs
            if (pathname === '/index.html' || pathname === '/project/index.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/${query}`);
              return res.end();
            }
            if (pathname === '/services.html' || pathname === '/project/services.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/services${query}`);
              return res.end();
            }
            if (pathname === '/about.html' || pathname === '/project/about.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/about${query}`);
              return res.end();
            }
            if (pathname === '/contact.html' || pathname === '/project/contact.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/contact${query}`);
              return res.end();
            }
            if (pathname === '/privacy.html' || pathname === '/project/privacy.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/privacy${query}`);
              return res.end();
            }
            if (pathname === '/terms.html' || pathname === '/project/terms.html') {
              res.statusCode = 301;
              res.setHeader('Location', `/terms${query}`);
              return res.end();
            }
            if (pathname === '/faqs') {
              res.statusCode = 301;
              res.setHeader('Location', `/services${query}`);
              return res.end();
            }

            // Internal rewrite for clean URLs so Vite serves the correct HTML document
            if (pathname === '/services') {
              req.url = `/services.html${query}`;
            } else if (pathname === '/about') {
              req.url = `/about.html${query}`;
            } else if (pathname === '/contact') {
              req.url = `/contact.html${query}`;
            } else if (pathname === '/privacy') {
              req.url = `/privacy.html${query}`;
            } else if (pathname === '/terms') {
              req.url = `/terms.html${query}`;
            } else if (pathname === '/404') {
              req.url = `/404.html${query}`;
            } else if (pathname === '/project/') {
              req.url = `/index.html${query}`;
            } else if (pathname.startsWith('/project/')) {
              req.url = `${pathname.replace(/^\/project/, '')}${query}`;
            }
            next();
          });
        },
      },
    ],
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'project/index.html'),
          services: path.resolve(__dirname, 'project/services.html'),
          about: path.resolve(__dirname, 'project/about.html'),
          contact: path.resolve(__dirname, 'project/contact.html'),
          privacy: path.resolve(__dirname, 'project/privacy.html'),
          terms: path.resolve(__dirname, 'project/terms.html'),
          not_found: path.resolve(__dirname, 'project/404.html'),
        },
      },
    },
  };
});