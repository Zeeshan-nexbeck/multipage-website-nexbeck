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
          server.middlewares.use((req, _res, next) => {
            if (!req.url) return next();
            const [pathname, search] = req.url.split('?');
            const query = search ? `?${search}` : '';

            if (pathname === '/services') {
              req.url = `/services.html${query}`;
            } else if (pathname === '/about') {
              req.url = `/about.html${query}`;
            } else if (pathname === '/contact') {
              req.url = `/contact.html${query}`;
            } else if (pathname === '/faqs') {
              req.url = `/services.html${query}`;
            } else if (pathname === '/project/index.html' || pathname === '/project/') {
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
        },
      },
    },
  };
});
