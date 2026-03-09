# Backend API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

## Authentication
All admin routes require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### 1. Categories
```bash
# Get root categories
GET /categories

# Get category by ID with breadcrumb
GET /categories/:id

# Get children of a category
GET /categories/:id/children
```

### 2. Listings
```bash
# Get listings with pagination and filters
GET /listings?page=1&limit=10&categoryId=1&governorateId=1&sort=latest

# Get featured listings
GET /listings/featured

# Get latest listings
GET /listings/latest

# Get single listing with details
GET /listings/:id

# Increment view count
POST /listings/:id/view
Body: {}
```

### 3. Governorates
```bash
# Get all active governorates
GET /governorates
```

### 4. Notifications
```bash
# Get active notifications (public)
GET /notifications?page=1&limit=10

# Get notification by ID
GET /notifications/:id
```

### 5. Ads
```bash
# Get active ads
GET /ads
```

### 6. Search
```bash
# Full-text search
GET /search?q=keyword&governorateId=1&page=1&limit=10
```

### 7. Health Check
```bash
GET /health
```

---

## Admin Endpoints

### 1. Authentication

#### Register (if enabled)
```bash
POST /admin/auth/register
Content-Type: application/json

{
  "username": "admin2",
  "password": "SecurePassword123",
  "name": "Admin Name"
}
```

#### Login
```bash
POST /admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": 1,
      "username": "admin",
      "name": "مدير النظام"
    }
  },
  "message": "تم تسجيل الدخول بنجاح"
}
```

#### Get Profile
```bash
GET /admin/auth/me
Authorization: Bearer {token}
```

#### Logout
```bash
POST /admin/auth/logout
Authorization: Bearer {token}
```

---

### 2. Categories Management

#### Get all categories as tree
```bash
GET /admin/categories
Authorization: Bearer {token}
```

#### Create category
```bash
POST /admin/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "قسم جديد",
  "icon": "🎯",
  "image": "https://...",
  "parentId": null,
  "order": 0,
  "isActive": true
}
```

#### Update category
```bash
PUT /admin/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "قسم محدث",
  "icon": "🎯",
  "parentId": null,
  "order": 0,
  "isActive": true
}
```

#### Delete category
```bash
DELETE /admin/categories/:id
Authorization: Bearer {token}
```

---

### 3. Listings Management

#### Get all listings
```bash
GET /admin/listings?page=1&limit=10&categoryId=1&governorateId=1&sort=latest
Authorization: Bearer {token}
```

#### Create listing
```bash
POST /admin/listings
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "اسم الإدخال",
  "description": "وصف تفصيلي",
  "categoryId": 1,
  "governorateId": 1,
  "phone": "+963xxxxxxxxx",
  "whatsapp": "+963xxxxxxxxx",
  "email": "example@example.com",
  "website": "https://example.com",
  "instagram": "@example",
  "facebook": "@example",
  "tiktok": "@example",
  "location_lat": 33.5138,
  "location_lng": 36.2765,
  "address": "العنوان الكامل",
  "isFeatured": false,
  "isActive": true,
  "images": ["/uploads/image1.jpg", "/uploads/image2.jpg"]
}
```

#### Update listing
```bash
PUT /admin/listings/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "اسم محدث",
  "isFeatured": true,
  "isActive": true
}
```

#### Delete listing
```bash
DELETE /admin/listings/:id
Authorization: Bearer {token}
```

---

### 4. Governorates Management

#### Get all governorates
```bash
GET /admin/governorates
Authorization: Bearer {token}
```

#### Create governorate
```bash
POST /admin/governorates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "محافظة جديدة",
  "order": 0,
  "isActive": true
}
```

#### Update governorate
```bash
PUT /admin/governorates/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "اسم محدث",
  "order": 0,
  "isActive": true
}
```

#### Delete governorate
```bash
DELETE /admin/governorates/:id
Authorization: Bearer {token}
```

---

### 5. Ads Management

#### Get all ads
```bash
GET /admin/ads
Authorization: Bearer {token}
```

#### Create ad
```bash
POST /admin/ads
Authorization: Bearer {token}
Content-Type: application/json

{
  "image": "/uploads/ad.jpg",
  "linkType": "category",
  "linkId": 1,
  "linkUrl": "https://example.com",
  "order": 0,
  "startDate": "2026-02-26T00:00:00Z",
  "endDate": "2026-03-26T00:00:00Z",
  "isActive": true
}
```

#### Update ad
```bash
PUT /admin/ads/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "order": 0,
  "isActive": false
}
```

#### Delete ad
```bash
DELETE /admin/ads/:id
Authorization: Bearer {token}
```

#### Reorder ads
```bash
POST /admin/ads/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [3, 1, 2]
}
```

---

### 6. Notifications Management

#### Get all notifications (admin)
```bash
GET /admin/notifications?page=1&limit=10
Authorization: Bearer {token}
```

#### Create notification
```bash
POST /admin/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "العنوان",
  "body": "محتوى الإشعار",
  "image": "/uploads/image.jpg",
  "linkType": "listing",
  "linkId": 1,
  "linkUrl": "https://example.com",
  "isActive": true
}
```

#### Update notification
```bash
PUT /admin/notifications/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "عنوان محدث",
  "isActive": false
}
```

#### Delete notification
```bash
DELETE /admin/notifications/:id
Authorization: Bearer {token}
```

---

### 7. File Upload

#### Upload single image
```bash
POST /admin/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <binary image data>

Response:
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/filename.jpg"
  }
}
```

#### Upload multiple images
```bash
POST /admin/upload/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: <binary image data> (up to 10 files)

Response:
{
  "success": true,
  "data": [
    { "imageUrl": "/uploads/file1.jpg" },
    { "imageUrl": "/uploads/file2.jpg" }
  ]
}
```

#### Delete image
```bash
DELETE /admin/upload/image
Authorization: Bearer {token}
Content-Type: application/json

{
  "imageUrl": "/uploads/filename.jpg"
}
```

---

### 8. Admin Utils

#### Get database statistics
```bash
GET /admin/utils/stats
Authorization: Bearer {token}
```

#### Reset database (development only)
```bash
POST /admin/utils/reset-database
Authorization: Bearer {token}
```

#### Health check
```bash
GET /admin/utils/health
Authorization: Bearer {token}
```

---

### 9. Statistics

#### Get dashboard statistics
```bash
GET /admin/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalListings": 100,
    "activeListings": 95,
    "totalCategories": 50,
    "totalGovernorates": 14,
    "totalNotifications": 20,
    "totalAds": 5,
    "featuredListings": 10,
    "recentListings": [...]
  }
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "رسالة الخطأ بالعربية",
  "code": "ERR_CODE",
  "statusCode": 400,
  "timestamp": "2026-02-26T10:30:00Z"
}
```

### Common Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing token)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Testing with cURL

### Get token
```bash
curl -X POST http://localhost:4000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Use token in request
```bash
curl -X GET http://localhost:4000/api/v1/admin/categories \
  -H "Authorization: Bearer {token}"
```

---

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes
- Upload endpoints: 50 requests per 15 minutes

---

## Environment Variables

See `.env.example` for configuration.

---

Last Updated: February 26, 2026
