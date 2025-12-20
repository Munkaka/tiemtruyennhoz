# Hướng Dẫn Nhanh - Tiệm Truyện Nhỏ

## Những Gì Đã Được Sửa

1. **Trang chủ bây giờ hiển thị đúng danh sách truyện** (như ảnh mẫu bạn gửi)
2. **Đăng nhập Google thật** thay vì mã giả lập
3. **Giao diện đã đổi từ màu tím/indigo sang xanh dương**

## Bước Tiếp Theo (Quan Trọng!)

### 1. Lấy Google Client ID

Truy cập: https://console.cloud.google.com/apis/credentials

1. Tạo project mới (nếu chưa có)
2. Click "CREATE CREDENTIALS" → OAuth client ID
3. Chọn "Web application"
4. Thêm vào **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://your-netlify-domain.netlify.app
   ```
5. Copy Client ID (có dạng: `xxxxx.apps.googleusercontent.com`)

### 2. Tạo File .env

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_URL=https://tiemtruyennhoz.anhthu102726.workers.dev
VITE_GOOGLE_CLIENT_ID=PASTE_CLIENT_ID_Ở_ĐÂY
```

### 3. Deploy Frontend (Netlify)

**Cách 1: Tự động (Khuyên dùng)**
```bash
git add .
git commit -m "Update homepage and Google login"
git push origin main
```
Netlify sẽ tự động build và deploy.

**Nhớ thêm Environment Variables trong Netlify:**
- `VITE_API_URL`: `https://tiemtruyennhoz.anhthu102726.workers.dev`
- `VITE_GOOGLE_CLIENT_ID`: `YOUR_CLIENT_ID_HERE`

### 4. Deploy Backend (Cloudflare)

**Dành cho iPad/Mobile:**
1. Mở https://dash.cloudflare.com/
2. Workers & Pages → Chọn worker `tiemtruyennhoz`
3. Edit Code
4. Copy toàn bộ nội dung file `backend/worker.js`
5. Paste vào → Save and Deploy

### 5. Cập Nhật Database (Thêm cột email)

**Option A: Qua Dashboard**
1. Cloudflare Dashboard → D1 → tiem-truyen-nho-db
2. Console tab
3. Paste SQL từ file `backend/migrations/add_email_column.sql`
4. Run

**Option B: Qua CLI (máy tính)**
```bash
wrangler d1 execute tiem-truyen-nho-db --file=backend/migrations/add_email_column.sql --remote
```

## Test

1. Mở web đã deploy
2. Click nút "Đăng nhập"
3. Sẽ thấy nút "Sign in with Google" màu xanh
4. Click và chọn tài khoản Google
5. Sau khi login, trang sẽ reload và hiển thị thông tin user

## Files Tham Khảo

- **Chi tiết Google OAuth**: `GOOGLE_LOGIN_SETUP.md`
- **Chi tiết Deploy**: `DEPLOYMENT_GUIDE.md`
- **Lịch sử thay đổi**: `CHANGELOG.md`

## Hỗ Trợ

Nếu gặp lỗi:
1. Mở Console (F12) → xem lỗi gì
2. Kiểm tra VITE_GOOGLE_CLIENT_ID đã set đúng chưa
3. Kiểm tra domain đã add vào Google Console chưa
4. Kiểm tra backend đã deploy chưa
