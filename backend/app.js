import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
// CORS configuration: allow configured origins (comma-separated) or fallback to localhost:3000
app.use(cors({
    origin: (origin, callback) => {
        const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000')
            .split(',')
            .map(o => o.trim());
        // If no origin (same-origin or curl) or origin is in allowed list, accept
        if (!origin || allowed.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed for origin: ' + origin));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

export default app;
