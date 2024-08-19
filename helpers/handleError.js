class AppError extends Error{
    message
    httpCode
    constructor(message,httpCode) {
        super(message);
        this.message = message
        this.httpCode = httpCode
        Error.captureStackTrace(this)
    }
}
module.exports = AppError