import 'dotenv/config';
import { connectDB } from './db/db.js';
import app from './app.js';

const PORT = process.env.PORT || 4000; // default changed to 4000 to avoid Next.js dev port clash

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
