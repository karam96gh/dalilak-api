# 🚀 Dalilak Backend - دليلك

Backend API متكامل لتطبيق دليلك - منصة اكتشاف الخدمات والمتاجر

## ✨ الميزات

### ✅ المصادقة والأمان
- تسجيل دخول آمن مع JWT
- تشفير كلمات المرور مع bcrypt
- Rate limiting على جميع النقاط
- CORS محمي
- Helmet.js للأمان

### ✅ إدارة المحتوى الكاملة
- إدارة الفئات (3 مستويات هرمية)
- إدارة الإدخالات (listings)
- إدارة الحكومات (governorates)
- إدارة الإعلانات (ads)
- إدارة الإشعارات (notifications)

### ✅ البحث والفلترة
- بحث كامل النص (Full-text search)
- فلترة حسب الفئة والحكومات
- ترتيب حسب آخر/الأكثر شهرة

### ✅ إدارة الملفات
- رفع الصور (صورة واحدة/متعددة)
- حذف الصور
- التحقق من نوع وحجم الملفات
- مسار ثابت للملفات المرفوعة

### ✅ الإحصائيات
- إحصائيات لوحة التحكم
- عدادات في الوقت الفعلي
- حالة الصحة (Health check)

### ✅ البيانات الأولية الشاملة
- 14 محافظة سورية
- 50+ قسم متدرج
- مئات الإدخالات التجريبية
- بيانات إشعارات وإعلانات

---

## 🏗️ البنية

```
src/
├── app.ts                 # تطبيق Express الرئيسي
├── server.ts              # نقطة دخول السيرفر
├── config/                # إعدادات
│   ├── database.ts        # اتصال Prisma
│   ├── env.ts             # التحقق من المتغيرات
│   └── multer.ts          # إعدادات رفع الملفات
├── middleware/            # Middleware مخصص
│   ├── auth.middleware.ts     # المصادقة
│   ├── error.middleware.ts    # معالجة الأخطاء
│   ├── validate.middleware.ts # التحقق من البيانات
│   └── rateLimit.middleware.ts # تحديد المعدل
├── modules/               # وحدات المشروع
│   ├── auth/              # المصادقة
│   ├── categories/        # الفئات
│   ├── listings/          # الإدخالات
│   ├── governorates/      # الحكومات
│   ├── notifications/     # الإشعارات
│   ├── ads/               # الإعلانات
│   ├── upload/            # رفع الملفات
│   ├── stats/             # الإحصائيات
│   └── admin-utils/       # أدوات إدارية
└── utils/                 # مساعدات
    ├── ApiResponse.ts     # تنسيق الاستجابة
    ├── ApiError.ts        # معالجة الأخطاء
    └── paginate.ts        # pagination

prisma/
├── schema.prisma          # نموذج قاعدة البيانات
├── seed.ts                # البيانات الأولية
└── migrations/            # الهجرات
```

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 16+
- MySQL 8.0+
- npm أو yarn

### التثبيت

```bash
# 1. استنساخ وتثبيت
git clone <repo>
cd backend
npm install

# 2. تهيئة البيئة
cp .env.example .env
# حرّر .env وأضف بيانات قاعدة البيانات

# 3. إعداد قاعدة البيانات
npm run prisma:migrate    # إنشاء الجداول
npm run prisma:seed       # تحميل البيانات الأولية

# 4. تشغيل السيرفر
npm run dev               # تطوير (http://localhost:4000)
npm start                 # إنتاج
```

---

## 📚 نقاط النهاية الرئيسية

### العام (Public)
```
GET  /api/v1/categories           # جميع الفئات
GET  /api/v1/categories/:id       # فئة محددة
GET  /api/v1/listings             # الإدخالات مع الفلترة
GET  /api/v1/search?q=keyword     # بحث
GET  /api/v1/ads                  # الإعلانات النشطة
GET  /api/v1/notifications        # الإشعارات
GET  /api/v1/health               # فحص الصحة
```

### الإدارة (Admin)
```
POST   /api/v1/admin/auth/login              # تسجيل الدخول
GET    /api/v1/admin/categories              # إدارة الفئات
POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id

GET    /api/v1/admin/listings                # إدارة الإدخالات
POST   /api/v1/admin/listings
PUT    /api/v1/admin/listings/:id
DELETE /api/v1/admin/listings/:id

GET    /api/v1/admin/ads                     # إدارة الإعلانات
POST   /api/v1/admin/ads
POST   /api/v1/admin/ads/reorder

GET    /api/v1/admin/notifications           # إدارة الإشعارات
POST   /api/v1/admin/notifications
PUT    /api/v1/admin/notifications/:id

POST   /api/v1/admin/upload/image            # رفع الملفات
POST   /api/v1/admin/upload/images
DELETE /api/v1/admin/upload/image

GET    /api/v1/admin/stats                   # الإحصائيات
POST   /api/v1/admin/utils/reset-database    # إعادة تعيين (تطوير فقط)
```

---

## 🔐 الأوامر

```bash
npm run dev              # التطوير (hot reload)
npm run build            # البناء
npm start                # التشغيل (إنتاج)

# Prisma
npm run prisma:generate  # توليد العميل
npm run prisma:migrate   # تطبيق الهجرات
npm run prisma:seed      # تحميل البيانات
npm run prisma:studio    # واجهة ويب
```

---

## 🗄️ قاعدة البيانات

### الجداول الأساسية
- **AdminUser** - حسابات الإدارة
- **Governorate** - المحافظات
- **Category** - الفئات (هرمية)
- **Listing** - الإدخالات/المتاجر
- **ListingImage** - صور الإدخالات
- **Notification** - الإشعارات
- **Ad** - الإعلانات

### البيانات الأولية
```
✅ Admin: admin / admin123
✅ 14 محافظة
✅ 50+ قسم
✅ مئات الإدخالات
✅ إشعارات وإعلانات تجريبية
```

---

## 🔐 المصادقة

### Login
```bash
curl -X POST http://localhost:4000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### استخدام Token
```bash
Authorization: Bearer {token}
```

---

## ✅ معايير الجودة

- ✅ TypeScript (Full Type Safety)
- ✅ Validation (Zod)
- ✅ Error Handling (Custom)
- ✅ API Consistency
- ✅ Rate Limiting
- ✅ CORS Security
- ✅ Input Sanitization

---

## 🐛 استكشاف الأخطاء

### خطأ اتصال البيانات
```bash
# تأكد من MySQL
mysql -u root
# تحقق من DATABASE_URL في .env
```

### خطأ المنفذ يُستخدم
```bash
PORT=5000 npm run dev
```

### فشل الـ Seed
```bash
npm run prisma:migrate
npm run prisma:seed
```

---

## 📊 الإحصائيات

```bash
GET /api/v1/admin/stats Authorization
```

Response:
```json
{
  "totalListings": 100,
  "activeListings": 95,
  "totalCategories": 50,
  "totalGovernorates": 14,
  "totalNotifications": 20,
  "totalAds": 5,
  "featuredListings": 10,
  "recentListings": [...]
}
```

---

## 🔒 الأمان (قبل الإنتاج)

⚠️ **إجراءات ضرورية:**

```bash
# 1. غيّر JWT_SECRET
JWT_SECRET="secure-random-key-32-chars-minimum"

# 2. غيّر كلمة مرور Admin
# 3. استخدم قاعدة بيانات آمنة
# 4. فعّل HTTPS
# 5. جدد CORS
# 6. عطّل reset-database في الإنتاج
# 7. أضف تحقق أدوار أعمق
```

---

## 📖 التوثيق الكاملة

- [API Endpoints](./API_ENDPOINTS.md) - جميع نقاط النهاية
- [Quick Start](./QUICK_START.md) - دليل التشغيل السريع
- [Prisma Schema](./prisma/schema.prisma) - نموذج البيانات

---

## 🚧 المميزات القادمة

- ✅ نظام المراجعات والتقييمات
- ✅ نظام المفضلة
- ✅ Firebase Cloud Messaging
- ✅ نظام الأدوار (RBAC)
- ✅ معالجات الدفع
- ✅ تكامل Elasticsearch

---

## 📞 الدعم

للأسئلة والمساعدة:
- 📖 اقرأ التوثيق
- 🔍 تحقق من الـ tests
- 📧 تواصل مع الفريق

---

## 📄 الترخيص

MIT License - انظر LICENSE للتفاصيل

---

**آخر تحديث:** 26 فبراير 2026  
**الإصدار:** 1.0.0  
**الحالة:** جاهز للإنتاج (مع الإجراءات الأمنية المذكورة)
