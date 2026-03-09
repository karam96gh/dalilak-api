# 📦 Backend Architecture - البنية المعمارية

## 🏗️ الهيكل الكامل

```
backend/
├── 📄 README.md                    # ← ابدأ هنا
├── 📄 QUICK_START.md              # ← دليل التشغيل السريع
├── 📄 API_ENDPOINTS.md            # ← جميع النقاط مع أمثلة
├── 📄 TESTING.md                  # ← دليل الاختبار
├── 📄 COMPLETION_SUMMARY.md       # ← ملخص الإكمال
├── 📄 COMPLETION_CHECKLIST.md     # ← قائمة المراجعة
├── 📄 ARCHITECTURE.md             # ← هذا الملف
├── 📄 .env.example                # ← متغيرات البيئة
├── 📄 package.json                # ← التبعيات والأوامر
├── 📄 tsconfig.json               # ← إعدادات TypeScript
├── 📄 .gitignore                  # ← ملفات معطوبة للـ Git
│
├── 📁 src/
│   ├── 📄 server.ts               # ✅ نقطة الدخول (Bootstrap)
│   ├── 📄 app.ts                  # ✅ تطبيق Express الرئيسي
│   │
│   ├── 📁 config/                 # ⚙️ الإعدادات
│   │   ├── 📄 database.ts         # ✅ اتصال Prisma
│   │   ├── 📄 env.ts              # ✅ التحقق من البيئة
│   │   └── 📄 multer.ts           # ✅ إعدادات رفع الملفات
│   │
│   ├── 📁 middleware/             # 🔧 Middleware مخصص
│   │   ├── 📄 auth.middleware.ts     # ✅ JWT + Token Check
│   │   ├── 📄 validate.middleware.ts # ✅ Zod Validation
│   │   ├── 📄 error.middleware.ts    # ✅ معالجة الأخطاء
│   │   └── 📄 rateLimit.middleware.ts# ✅ تحديد المعدل
│   │
│   ├── 📁 modules/                # 📦 الوحدات الرئيسية
│   │   │
│   │   ├── 📁 auth/               # 🔐 المصادقة
│   │   │   ├── auth.controller.ts # ✅ Login, Logout, Me
│   │   │   ├── auth.service.ts    # ✅ JWT Token, Password Hash
│   │   │   ├── auth.routes.ts     # ✅ POST /login, /logout, GET /me
│   │   │   └── auth.dto.ts        # ✅ LoginDto Validation
│   │   │
│   │   ├── 📁 categories/         # 📂 الفئات
│   │   │   ├── category.controller.ts # ✅ CRUD Operations
│   │   │   ├── category.service.ts    # ✅ Hierarchical Tree
│   │   │   ├── category.routes.ts     # ✅ Public + Admin Routes
│   │   │   └── category.dto.ts        # ✅ Create/Update Validation
│   │   │
│   │   ├── 📁 listings/           # 📋 الإدخالات/المتاجر
│   │   │   ├── listing.controller.ts # ✅ Full CRUD
│   │   │   ├── listing.service.ts    # ✅ Search, Filter, Paginate
│   │   │   ├── listing.routes.ts     # ✅ Public + Admin Routes
│   │   │   └── listing.dto.ts        # ✅ Comprehensive Validation
│   │   │
│   │   ├── 📁 governorates/       # 🏛️ الحكومات/المحافظات
│   │   │   ├── governorate.controller.ts # ✅ CRUD
│   │   │   ├── governorate.service.ts    # ✅ Validation
│   │   │   ├── governorate.routes.ts     # ✅ Routes
│   │   │   └── governorate.dto.ts        # ✅ DTOs
│   │   │
│   │   ├── 📁 ads/                # 📢 الإعلانات
│   │   │   ├── ad.controller.ts   # ✅ CRUD + Reorder
│   │   │   ├── ad.service.ts      # ✅ Date-based Filtering
│   │   │   ├── ad.routes.ts       # ✅ Routes with Validation
│   │   │   └── ad.dto.ts          # ✅ DTOs (NEW)
│   │   │
│   │   ├── 📁 notifications/      # 🔔 الإشعارات
│   │   │   ├── notification.controller.ts # ✅ CRUD
│   │   │   ├── notification.service.ts    # ✅ Pagination
│   │   │   ├── notification.routes.ts     # ✅ Routes
│   │   │   └── notification.dto.ts        # ✅ DTOs (NEW)
│   │   │
│   │   ├── 📁 upload/             # 📤 رفع الملفات
│   │   │   ├── upload.controller.ts  # ✅ Upload, Delete
│   │   │   ├── upload.service.ts     # ✅ File Management (NEW)
│   │   │   └── upload.routes.ts      # ✅ Routes
│   │   │
│   │   ├── 📁 stats/              # 📊 الإحصائيات
│   │   │   └── stats.ts           # ✅ Dashboard Stats
│   │   │
│   │   └── 📁 admin-utils/        # 🛠️ أدوات الإدارة (NEW)
│   │       ├── admin-utils.controller.ts # ✅ Reset, Stats, Health
│   │       └── admin-utils.routes.ts     # ✅ Routes
│   │
│   └── 📁 utils/                  # 🔧 Utilities
│       ├── 📄 ApiResponse.ts       # ✅ Response Formatter
│       ├── 📄 ApiError.ts         # ✅ Error Handler
│       └── 📄 paginate.ts         # ✅ Pagination Helper
│
├── 📁 prisma/
│   ├── 📄 schema.prisma           # ✅ Database Schema
│   │   ├── AdminUser              # ← Admin Accounts
│   │   ├── Governorate            # ← 14 Governorates
│   │   ├── Category               # ← 50+ Categories (3 Levels)
│   │   ├── Listing                # ← Business Listings
│   │   ├── ListingImage           # ← Images for Listings
│   │   ├── Notification           # ← Notifications
│   │   └── Ad                     # ← Advertisements
│   │
│   ├── 📄 seed.ts                 # ✅ Initial Data (Seed)
│   │   ├── 1 Admin User
│   │   ├── 14 Governorates
│   │   ├── 50+ Categories
│   │   ├── Hundreds of Listings
│   │   ├── 5 Notifications
│   │   └── 3 Ads
│   │
│   ├── 📄 migrations/
│   │   ├── 📄 migration_lock.toml
│   │   └── 📁 20260221033217_init/
│   │       └── 📄 migration.sql   # ← Initial Schema
│   │
│   └── 📄 client.prisma           # ✅ Generated
│
└── 📁 uploads/                    # 📁 Uploaded Files
    └── 📄 .gitkeep
```

---

## 🔄 طلب Response Cycle

```
1. HTTP Request
   ↓
2. helmet() [Security Headers]
   ↓
3. cors() [Cross-Origin]
   ↓
4. express.json() [Parse JSON]
   ↓
5. generalLimiter [Rate Limiting]
   ↓
6. Router (Find Endpoint)
   ↓
7. validate() [DTOs - Zod]
   ↓
8. authMiddleware [JWT Check]
   ↓
9. Controller Method
   ↓
10. Service (Business Logic)
   ↓
11. Database (Prisma)
   ↓
12. ApiResponse [Format Response]
   ↓
13. HTTP Response (JSON)
```

---

## 🔐 Security Layers

```
Layer 1: Helmet.js         [HTTP Headers]
         ↓
Layer 2: CORS              [Origin Check]
         ↓
Layer 3: Rate Limiting     [Request Throttle]
         ↓
Layer 4: JWT Auth          [Token Validation]
         ↓
Layer 5: Zod Validation    [Input Sanitization]
         ↓
Layer 6: Error Handling    [Safe Error Messages]
```

---

## 📊 Data Flow

### Public Endpoint Example
```
GET /api/v1/categories

1. Router matches endpoint
2. CategoryController.getRootCategories()
3. CategoryService.getRootCategories()
4. Prisma query (from database)
5. ApiResponse.ok(data)
6. Response back to client
```

### Admin Endpoint Example
```
POST /api/v1/admin/listings

1. Request arrives
2. Rate Limit check ✓
3. JSON parse ✓
4. Validation (Zod) ✓
5. Auth middleware (JWT) ✓
6. ListingController.create()
7. ListingService.create()
8. Prisma insert (database)
9. ApiResponse.ok(data, "Created")
10. 201 Response to client
```

---

## 🗄️ Database Connection

```
Prisma Schema
    ↓
Generator (Generate Prisma Client)
    ↓
.prisma/client
    ↓
MySQL Database
    ↓
Tables:
├── admin_users         (1 row needed)
├── governorates        (14 rows)
├── categories          (50+ rows)
├── listings            (hundreds)
├── listing_images      (thousands)
├── notifications       (5+ rows)
└── ads                 (3+ rows)
```

---

## 🔧 Environment Variables

```
.env (Local Development)
├── DATABASE_URL       ← MySQL Connection
├── JWT_SECRET         ← Token Secret
├── JWT_EXPIRES_IN     ← Token TTL
├── PORT               ← Server Port
├── NODE_ENV           ← Environment
├── UPLOAD_DIR         ← File Storage
└── MAX_FILE_SIZE      ← Upload Limit
```

---

## 📚 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "تم بنجاح",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 100 }
}
```

### Error Response
```json
{
  "success": false,
  "message": "رسالة الخطأ",
  "errors": [
    { "field": "name", "message": "مطلوب" }
  ]
}
```

---

## 🚀 Deployment Architecture

```
Development
├── npm run dev
├── Hot Reload
├── Debug Logging
└── Development DB

Production
├── npm run build → dist/
├── npm start
├── Production DB (AWS RDS)
├── HTTPS
└── Environment Variables (Secrets Manager)
```

---

## 📈 Scalability Ready

```
✅ Database Indexing       [Faster Queries]
✅ Pagination             [Large Datasets]
✅ Rate Limiting          [Traffic Control]
✅ Error Handling         [Stability]
✅ Validation             [Data Integrity]
✅ Logging               [Monitoring]
✅ Connection Pooling    [Resource Management]
```

---

## 🎯 Module Responsibilities

| Module | Responsibility | Status |
|--------|----------------|--------|
| auth | User Authentication | ✅ |
| categories | Category Management | ✅ |
| listings | Business Listings | ✅ |
| governorates | Geographic Areas | ✅ |
| ads | Advertisement Management | ✅ |
| notifications | User Notifications | ✅ |
| upload | File Management | ✅ |
| stats | Dashboard Analytics | ✅ |
| admin-utils | Admin Tools | ✅ |

---

## 📞 Integration Points

### Frontend Integration
```
Admin (Next.js) → Backend API → Database
Flutter App → Backend API → Database
```

### API Consumption
```
Client sends HTTP request
    ↓
Backend validates & processes
    ↓
Returns JSON response
    ↓
Client updates UI
```

---

**آخر تحديث:** 26 فبراير 2026  
**الحالة:** ✅ جاهز للعمل
