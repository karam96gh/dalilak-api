# Backend Setup Guide

دليل سريع لتشغيل Backend لتطبيق دليلك

## المتطلبات

- Node.js 16+
- MySQL 8.0+
- npm أو yarn

## التثبيت والتشغيل

### 1. نسخ المتغيرات البيئية

```bash
cp .env.example .env
```

### 2. تحديث ملف `.env`

عدّل ملف `.env` بإضافة بيانات اتصال قاعدة البيانات:

```env
DATABASE_URL="mysql://root:password@localhost:3306/dalilak"
JWT_SECRET="change-this-to-a-secure-random-string"
NODE_ENV="development"
```

### 3. تثبيت المكتبات

```bash
npm install
```

### 4. تهيئة قاعدة البيانات

```bash
# إنشاء الجداول
npm run prisma:migrate

# تحميل البيانات الأولية
npm run prisma:seed
```

### 5. بدء السيرفر

```bash
# وضع التطوير (مع Hot Reload)
npm run dev

# وضع الإنتاج
npm run build
npm start
```

السيرفر سيبدأ على `http://localhost:4000`

---

## البيانات الأولية

تم توفير بيانات أولية شاملة تشمل:

- **حساب Admin:** 
  - اسم المستخدم: `admin`
  - كلمة المرور: `admin123`

- **14 محافظة** بسوريا

- **50+ قسم** في 3 مستويات:
  - مطاعم وكافيهات
  - محلات تجارية
  - أطباء ومستشفيات
  - تعليم وتدريب
  - وأكثر...

- **مئات الإدخالات** (listings) مع صور

- **إشعارات تجريبية**

- **إعلانات تجريبية**

---

## نقاط النهاية الرئيسية

### تسجيل الدخول
```bash
POST /api/v1/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### الفئات
```bash
GET /api/v1/admin/categories
GET /api/v1/admin/categories/:id
POST /api/v1/admin/categories
PUT /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

### الإدخالات
```bash
GET /api/v1/admin/listings
GET /api/v1/admin/listings/:id
POST /api/v1/admin/listings
PUT /api/v1/admin/listings/:id
DELETE /api/v1/admin/listings/:id
```

### الإعلانات
```bash
GET /api/v1/admin/ads
POST /api/v1/admin/ads
PUT /api/v1/admin/ads/:id
DELETE /api/v1/admin/ads/:id
POST /api/v1/admin/ads/reorder
```

### الإشعارات
```bash
GET /api/v1/admin/notifications
POST /api/v1/admin/notifications
PUT /api/v1/admin/notifications/:id
DELETE /api/v1/admin/notifications/:id
```

### رفع الصور
```bash
POST /api/v1/admin/upload/image (صورة واحدة)
POST /api/v1/admin/upload/images (عدة صور)
DELETE /api/v1/admin/upload/image
```

---

## الأوامر المتاحة

```bash
# التطوير
npm run dev

# البناء
npm run build

# الإنتاج
npm start

# Prisma - إدارة قاعدة البيانات
npm run prisma:generate   # توليد Prisma Client
npm run prisma:migrate    # تطبيق الهجرات
npm run prisma:seed       # تحميل البيانات الأولية
npm run prisma:studio     # واجهة الويب لـ Prisma

# الاختبار (عند الإضافة)
npm test
```

---

## جودة الكود

### التفتيش
```bash
# TypeScript
npm run type-check

# ESLint
npm run lint
```

### التنسيق
```bash
npm run format
```

---

## استكشاف الأخطاء

### المشكلة: `DATABASE_URL is required`

**الحل:** تأكد من وجود ملف `.env` مع `DATABASE_URL` صحيحة

```bash
cp .env.example .env
# حرّر .env وأضف بيانات قاعدة البيانات
```

### المشكلة: `Error: connect ECONNREFUSED`

**الحل:** تأكد من أن MySQL يعمل:

```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### المشكلة: `Port 4000 already in use`

**الحل:** غيّر PORT في `.env`:

```env
PORT=5000
```

### المشكلة: فشل Prisma Seed

**الحل:** تحقق من الهجرات:

```bash
npm run prisma:migrate
npm run prisma:seed
```

---

## التكامل مع Frontend

عند استخدام Next.js Admin:

```typescript
// .env.local (في مجلد admin)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

عند استخدام Flutter:

```dart
// في apiClient.dart
apiClient = ApiClient(
  baseUrl: 'http://192.168.x.x:4000/api/v1', // استخدم IP الجهاز الفعلي
);
```

---

## الأمان

⚠️ **تحذير:** البيانات الحالية للتطوير فقط

### قبل الإنتاج:
1. غيّر `JWT_SECRET` إلى سر قوي
2. استخدم قاعدة بيانات آمنة (AWS RDS أو DigitalOcean)
3. استخدم HTTPS
4. فعّل تحقق من الأدوار والصلاحيات (RBAC)
5. أضف العناية بـ CORs المناسبة
6. استخدم Rate Limiting الصارم
7. قم بتعطيل `/admin/utils/reset-database` في الإنتاج

---

## المرة القادمة

- ✅ إضافة المراجعات والتقييمات
- ✅ نظام المفضلة
- ✅ Firebase Cloud Messaging
- ✅ تكامل الدفع
- ✅ نظام الأدوار والصلاحيات (RBAC)
- ✅ بحث متقدم مع Elasticsearch

---

## الدعم

للمساعدة والاستفسارات، راجع:
- [API Documentation](./API_ENDPOINTS.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)

---

آخر تحديث: 26 فبراير 2026
