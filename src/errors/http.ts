class HttpError extends Error {
    public statusCode: number;
    public error: any;
    public status: string;

    constructor(message: string, statusCode: number, error?: any) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.status = statusCode < 500 ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

export { HttpError };
