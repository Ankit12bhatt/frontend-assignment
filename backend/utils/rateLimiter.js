import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 60, 
    message: 'Too many requests from this IP, please try again after 1 minutes',
    headers: true, 
    validate: {
        xForwardedForHeader: false,
        trustProxy: false,
    }
});