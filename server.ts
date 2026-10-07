import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const distPath = path.resolve(__dirname, 'dist');

// Serve static assets from dist directory
app.use(express.static(distPath));

// Clean URL routing for the 5-page site
app.get('/services', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'services.html'));
});

app.get('/about', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'about.html'));
});

app.get('/faqs', (_req: Request, res: Response) => {
  res.redirect(301, '/services#faq');
});

app.get('/contact', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'contact.html'));
});

// Fallback to index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexbeck production server running on http://0.0.0.0:${PORT}`);
});
