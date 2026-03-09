import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100,
    message: {
        success: false,
        message: 'عدد الطلبات كثير جداً، حاول مرة أخرى لاحقاً',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'محاولات تسجيل دخول كثيرة، حاول مرة أخرى بعد 15 دقيقة',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
