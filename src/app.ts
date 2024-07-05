import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// file imports
import { logger, secrets } from '@/core';
import {
    authRoutes,
    blogRoutes,
    categoryRoutes,
    qaRoutes,
    tagRoutes,
    userRoutes,
} from '@/routes';

// app
const app: Express = express();

// app configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(logger.httpExpress);

// middleware
app.use(
    cors({
        origin: [secrets.ALLOW_ORIGIN_ONE],
        credentials: true,
        preflightContinue: true,
        optionsSuccessStatus: 204,
    })
);
app.use(helmet());
app.use(cookieParser());

// app routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/qas', qaRoutes);
app.use('/api/v1/users', userRoutes);

// app routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World! updated' });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// export app
export default app;
