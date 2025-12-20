# Hướng Dẫn Cấu Hình Đăng Nhập Google

## Bước 1: Tạo Google OAuth Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Nếu chưa có project, tạo project mới
3. Bấm **"+ CREATE CREDENTIALS"** → Chọn **"OAuth client ID"**
4. Nếu được yêu cầu, cấu hình OAuth consent screen trước:
   - Chọn "External"
   - Điền tên ứng dụng: **Tiệm Truyện Nhỏ**
   - Điền email support
   - Thêm logo (tùy chọn)
   - Bấm **Save and Continue**

5. Quay lại tạo OAuth Client ID:
   - Application type: **Web application**
   - Name: **Tiệm Truyện Nhỏ Web**

6. **Authorized JavaScript origins** - Thêm các URL sau:
   ```
   http://localhost:5173
   https://your-vercel-domain.vercel.app
   https://your-netlify-domain.netlify.app
   ```

7. **Authorized redirect URIs** - KHÔNG CẦN (Google Sign-In button không dùng redirect)

8. Bấm **Create** và copy **Client ID**

## Bước 2: Cấu Hình File .env

Tạo file `.env` trong thư mục root của project:

```bash
VITE_API_URL=https://tiemtruyennhoz.anhthu102726.workers.dev
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

Thay `YOUR_CLIENT_ID_HERE` bằng Client ID vừa copy.

## Bước 3: Cấu Hình Backend (Optional)

Backend hiện tại đã hỗ trợ nhận thông tin từ Google. File `backend/worker.js` endpoint `/api/sync-user` sẽ lưu thông tin người dùng từ Google vào database D1.

## Bước 4: Test

1. Chạy dev server: `npm run dev`
2. Bấm nút "Đăng nhập"
3. Bấm vào nút **"Sign in with Google"**
4. Chọn tài khoản Google
5. Cho phép ứng dụng truy cập thông tin cơ bản

## Lưu Ý

- Google Client ID là PUBLIC và có thể commit lên Git (không phải secret)
- Mỗi môi trường (localhost, staging, production) cần được thêm vào Authorized JavaScript origins
- Nếu deploy lên Vercel/Netlify, cần thêm biến môi trường `VITE_GOOGLE_CLIENT_ID` trong dashboard

## Troubleshooting

### Lỗi: "Not a valid origin for the client"
→ Thêm domain hiện tại vào **Authorized JavaScript origins** trong Google Console

### Button Google không hiển thị
→ Kiểm tra file `.env` có đúng tên biến `VITE_GOOGLE_CLIENT_ID` không (phải có prefix VITE_)

### Sau khi đăng nhập, trang không reload
→ Kiểm tra Console log, có thể backend không nhận được request đồng bộ user
