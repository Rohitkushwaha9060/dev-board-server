import http from 'http';
import * as socketIO from 'socket.io';

// file imports
import app from '@/app';
import { secrets, logger } from '@/core';
import { globalErrorHandler } from '@/middlewares';

// server
const server = http.createServer(app);

// socket.io initialization
const io = new socketIO.Server(server, {
    cors: {
        origin: [secrets.ALLOW_ORIGIN_ONE],
        optionsSuccessStatus: 204,
        preflightContinue: true,
    },
});

// set up socket.io
io.on('connection', (socket) => {
    logger.info('A user connected ' + socket.id);

    socket.on('disconnect', () => {
        logger.info('A user disconnected ' + socket.id);
    });
});

// set io in app
app.set('socket', io);

// global error handler
app.use(globalErrorHandler);

// listen server
server.listen(secrets.PORT, () => {
    logger.info(`Server is running on port ${secrets.PORT}`);
});
