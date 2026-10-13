import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.resolve(__dirname, 'dist');

// Enable Gzip/Deflate compression on all responses (reduces transfer sizes by 75-80%)
app.use(compression());

// Serve static assets with high-performance HTTP caching headers
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML revalidates quickly so new deployments are picked up immediately
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else {
      // CSS, JS, SVG assets are cached aggressively for instant repeat paints
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// Clean URL routing for the 5-page site
app.get('/services', (req, res) => {
  res.sendFile(path.join(distPath, 'services.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(distPath, 'about.html'));
});

app.get('/faqs', (_req, res) => {
  res.redirect(301, '/services#faq');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(distPath, 'contact.html'));
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexbeck production server running on http://0.0.0.0:${PORT}`);
});
