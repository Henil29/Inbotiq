import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env from repo root (../.env) so you can keep a single .env at the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { connectDB } from './db/db.js';
import app from './app.js';

const PORT = process.env.PORT || 4000; // default changed to 4000 to avoid Next.js dev port clash

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
