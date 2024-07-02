import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// file imports
import { logger, secrets } from '@/core';
import { authRoutes } from '@/routes';

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

// app routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

// export app
export default app;
