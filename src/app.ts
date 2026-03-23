import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import 'express-async-errors';

import { errorMiddleware } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Public routes
import categoryRoutes from './modules/categories/category.routes';
import listingRoutes from './modules/listings/listing.routes';
import governorateRoutes from './modules/governorates/governorate.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import adRoutes from './modules/ads/ad.routes';

// Admin routes
import authRoutes from './modules/auth/auth.routes';
import { adminCategoryRouter } from './modules/categories/category.routes';
import { adminListingRouter } from './modules/listings/listing.routes';
import { adminGovernorateRouter } from './modules/governorates/governorate.routes';
import { adminNotificationRouter } from './modules/notifications/notification.routes';
import { adminAdRouter } from './modules/ads/ad.routes';
import uploadRoutes from './modules/upload/upload.routes';
import adminUtilsRoutes from './modules/admin-utils/admin-utils.routes';
import { statsController } from './modules/stats';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : '*',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Public API routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/governorates', governorateRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/ads', adRoutes);

// Search (uses listing controller)
import { ListingController } from './modules/listings/listing.controller';
const listingController = new ListingController();
app.get('/api/v1/search', listingController.search);

// Admin routes
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin/categories', adminCategoryRouter);
app.use('/api/v1/admin/listings', adminListingRouter);
app.use('/api/v1/admin/governorates', adminGovernorateRouter);
app.use('/api/v1/admin/notifications', adminNotificationRouter);
app.use('/api/v1/admin/ads', adminAdRouter);
app.use('/api/v1/admin/upload', uploadRoutes);
app.use('/api/v1/admin/utils', adminUtilsRoutes);
app.get('/api/v1/admin/stats', statsController);

// Health check
app.get('/api/v1/health', (_req, res) => {
    res.json({ success: true, message: 'Dalilak API is running 🚀' });
});

// Error handler (must be last)
app.use(errorMiddleware);

export default app;
