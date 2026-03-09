# Testing Guide - دليل الاختبار

دليل شامل لاختبار نقاط نهاية API

---

## 🚀 البدء السريع

### 1. تشغيل السيرفر

```bash
npm run dev
# السيرفر يبدأ على http://localhost:4000
```

### 2. إعداد Postman/cURL

استورد بيانات الاختبار التالية:

---

## 📋 اختبارات قائمة بذاتها

### 1️⃣ Health Check (لا يتطلب مصادقة)

```bash
curl http://localhost:4000/api/v1/health

# النتيجة المتوقعة
{
  "success": true,
  "message": "Dalilak API is running 🚀"
}
```

### 2️⃣ تسجيل الدخول

```bash
curl -X POST http://localhost:4000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# احفظ TOKEN من الاستجابة
# Token: eyJhbGciOiJIUzI1NiIs...
```

---

## 🔐 الاختبارات التي تتطلب مصادقة

استبدل `{token}` بـ Token من خطوة التسجيل أعلاه

### 3️⃣ الفئات

#### الحصول على جميع الفئات

```bash
curl http://localhost:4000/api/v1/categories
```

#### إضافة فئة جديدة

```bash
curl -X POST http://localhost:4000/api/v1/admin/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "قسم جديد للاختبار",
    "icon": "🧪",
    "parentId": null,
    "order": 100,
    "isActive": true
  }'
```

#### تحديث فئة

```bash
curl -X PUT http://localhost:4000/api/v1/admin/categories/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "القسم المحدث",
    "order": 50
  }'
```

#### حذف فئة

```bash
curl -X DELETE http://localhost:4000/api/v1/admin/categories/1 \
  -H "Authorization: Bearer {token}"
```

---

### 4️⃣ الإدخالات

#### الحصول على الإدخالات

```bash
# الكل
curl http://localhost:4000/api/v1/listings

# مع صفحات
curl http://localhost:4000/api/v1/listings?page=1&limit=10

# مع فلاتر
curl "http://localhost:4000/api/v1/listings?categoryId=1&governorateId=1"

# البحث
curl "http://localhost:4000/api/v1/search?q=مطعم"
```

#### إضافة إدخال جديد

```bash
curl -X POST http://localhost:4000/api/v1/admin/listings \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مطعم الاختبار",
    "description": "وصف تجريبي",
    "categoryId": 1,
    "governorateId": 1,
    "phone": "+963912345678",
    "email": "test@example.com",
    "isFeatured": false,
    "isActive": true
  }'
```

#### تحديث إدخال

```bash
curl -X PUT http://localhost:4000/api/v1/admin/listings/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "الاسم المحدث",
    "isFeatured": true
  }'
```

---

### 5️⃣ الحكومات

#### الحصول على الحكومات

```bash
curl http://localhost:4000/api/v1/governorates
```

#### إضافة حكومة

```bash
curl -X POST http://localhost:4000/api/v1/admin/governorates \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محافظة اختبار",
    "order": 20,
    "isActive": true
  }'
```

---

### 6️⃣ الإعلانات

#### الحصول على الإعلانات

```bash
curl http://localhost:4000/api/v1/ads
```

#### إضافة إعلان

```bash
curl -X POST http://localhost:4000/api/v1/admin/ads \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/uploads/ad-test.jpg",
    "linkType": "category",
    "linkId": 1,
    "order": 0,
    "isActive": true
  }'
```

---

### 7️⃣ الإشعارات

#### الحصول على الإشعارات

```bash
curl http://localhost:4000/api/v1/notifications
```

#### إضافة إشعار

```bash
curl -X POST http://localhost:4000/api/v1/admin/notifications \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "إشعار تجريبي",
    "body": "هذا إشعار للاختبار",
    "isActive": true
  }'
```

---

### 8️⃣ رفع الملفات

#### رفع صورة واحدة

```bash
curl -X POST http://localhost:4000/api/v1/admin/upload/image \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/image.jpg"
```

#### رفع عدة صور

```bash
curl -X POST http://localhost:4000/api/v1/admin/upload/images \
  -H "Authorization: Bearer {token}" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

### 9️⃣ الإحصائيات

#### الحصول على إحصائيات لوحة التحكم

```bash
curl http://localhost:4000/api/v1/admin/stats \
  -H "Authorization: Bearer {token}"
```

#### إعادة تعيين قاعدة البيانات (تطوير فقط)

```bash
curl -X POST http://localhost:4000/api/v1/admin/utils/reset-database \
  -H "Authorization: Bearer {token}"
```

---

## 🧪 استخدام Postman

### 1. استيراد المتغيرات

أنشئ Postman Collection مع البيانات التالية:

```json
{
  "info": {
    "name": "Dalilak API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "categoryId",
      "value": "1"
    },
    {
      "key": "listingId",
      "value": "1"
    }
  ]
}
```

### 2. استخدام المتغيرات

في الطلبات، استخدم:
```
{{baseUrl}}/endpoint
Authorization: Bearer {{token}}
```

---

## ✅ قائمة الاختبارات اليدوية

- [ ] Health Check (بدون مصادقة)
- [ ] تسجيل دخول صحيح
- [ ] تسجيل دخول خاطئ
- [ ] الحصول على الفئات (بدون مصادقة)
- [ ] إضافة فئة (مع مصادقة)
- [ ] تحديث فئة
- [ ] حذف فئة
- [ ] الحصول على الإدخالات (بدون مصادقة)
- [ ] البحث (بدون مصادقة)
- [ ] إضافة إدخال (مع مصادقة)
- [ ] تحديث إدخال
- [ ] حذف إدخال
- [ ] رفع صورة
- [ ] الحصول على الإحصائيات

---

## 🔍 اختبار الأخطاء

### اختبار بيانات غير صحيحة

```bash
# بدون اسم (مطلوب)
curl -X POST http://localhost:4000/api/v1/admin/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": null,
    "order": 0
  }'

# النتيجة المتوقعة: خطأ 400 - بيانات غير صحيحة
```

### اختبار بدون مصادقة

```bash
curl -X POST http://localhost:4000/api/v1/admin/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "test"}'

# النتيجة المتوقعة: خطأ 401 - غير مصرح
```

### اختبار Token غير صحيح

```bash
curl http://localhost:4000/api/v1/admin/stats \
  -H "Authorization: Bearer invalid-token"

# النتيجة المتوقعة: خطأ 403 - Token غير صحيح
```

---

## 📊 اختبارات الأداء

### اختبار Pagination

```bash
# الصفحة 1
curl "http://localhost:4000/api/v1/listings?page=1&limit=10"

# الصفحة 2
curl "http://localhost:4000/api/v1/listings?page=2&limit=10"

# حد أقصى
curl "http://localhost:4000/api/v1/listings?page=1&limit=100"
```

### اختبار الفلترة

```bash
# بفئة
curl "http://localhost:4000/api/v1/listings?categoryId=1"

# بحكومة
curl "http://localhost:4000/api/v1/listings?governorateId=1"

# مميزة فقط
curl "http://localhost:4000/api/v1/listings?featured=true"

# مجموعة
curl "http://localhost:4000/api/v1/listings?categoryId=1&governorateId=1&featured=true"
```

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Token is required"
✅ **الحل:** استخدم `Authorization: Bearer {token}`

### الخطأ: "Invalid token"
✅ **الحل:** تأكد من أن Token صحيح وجديد

### الخطأ: "Database connection failed"
✅ **الحل:** تحقق من MySQL وملف `.env`

### الخطأ: "Validation error"
✅ **الحل:** تحقق من JSON وتطابق الحقول المطلوبة

---

## 📝 ملخص الاختبارات

```
✅ Public Endpoints:     7 اختبارات
✅ Admin Endpoints:     30+ اختبار
✅ Error Cases:         10+ اختبارات
✅ Performance:         5+ اختبارات

إجمالي: 50+ اختبار
```

---

آخر تحديث: 26 فبراير 2026
