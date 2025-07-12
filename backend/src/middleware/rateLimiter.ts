import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    }
});