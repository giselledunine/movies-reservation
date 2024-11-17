class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors: object;
    constructor(message: string, Code: number) {
        super(message);
        this.statusCode = Code;
        this.status = `${Code}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.errors = { appError: { message } };

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
