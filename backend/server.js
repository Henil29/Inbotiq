import 'dotenv/config';
import { connectDB } from './db/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
