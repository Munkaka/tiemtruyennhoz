# Hướng Dẫn Deploy Tiệm Truyện Nhỏ

## Tổng Quan

Project này bao gồm:
- **Frontend**: React + Vite (deploy lên Netlify/Vercel)
- **Backend**: Cloudflare Workers + D1 Database

## 1. Deploy Frontend (Netlify - AUTOMATIC)

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Update homepage and Google login"
git push origin main
```

### Bước 2: Kết nối Netlify với GitHub
1. Đăng nhập [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Chọn GitHub và authorize
4. Chọn repository `tiemtruyennhoz`
5. Build settings sẽ tự động được điền:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Thêm Environment Variables:
   - `VITE_API_URL`: `https://tiemtruyennhoz.anhthu102726.workers.dev`
   - `VITE_GOOGLE_CLIENT_ID`: (Client ID từ Google Console)
7. Click "Deploy site"

### Bước 3: Cấu hình Custom Domain (Optional)
1. Site settings → Domain management
2. Add custom domain
3. Cập nhật DNS records theo hướng dẫn

## 2. Deploy Backend (Cloudflare Workers - MANUAL)

### Phương án A: Deploy qua Dashboard (Dành cho iPad/Mobile)

1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Chọn **Workers & Pages**
3. Tìm Worker tên `tiemtruyennhoz` (hoặc tạo mới)
4. Click **"Edit code"**
5. Copy toàn bộ nội dung file `backend/worker.js`
6. Paste vào editor
7. Click **"Save and Deploy"**

### Phương án B: Deploy qua CLI (Dành cho máy tính)

```bash
cd backend
npm install
npm run deploy
```

### Bước 4: Cập nhật Database Schema

Nếu bạn thêm tính năng mới cần cột email trong database:

```bash
# Chạy migration để thêm cột email
wrangler d1 execute tiem-truyen-nho-db --file=backend/migrations/add_email_column.sql --remote
```

## 3. Cấu hình Google OAuth

Xem file [GOOGLE_LOGIN_SETUP.md](./GOOGLE_LOGIN_SETUP.md) để hướng dẫn chi tiết.

Tóm tắt:
1. Tạo OAuth Client ID tại [Google Console](https://console.cloud.google.com/apis/credentials)
2. Thêm authorized origins:
   - `http://localhost:5173` (dev)
   - `https://your-netlify-domain.netlify.app` (production)
3. Copy Client ID
4. Thêm vào Environment Variables của Netlify với key `VITE_GOOGLE_CLIENT_ID`

## 4. Kiểm Tra Deployment

### Frontend
- Truy cập URL Netlify (ví dụ: `https://your-site.netlify.app`)
- Kiểm tra trang chủ hiển thị danh sách truyện
- Thử đăng nhập bằng Google

### Backend
- Truy cập: `https://tiemtruyennhoz.anhthu102726.workers.dev/api/stories`
- Phải trả về JSON danh sách truyện

### Database
- Đăng nhập vào web
- Kiểm tra trong Cloudflare D1 Dashboard xem có user mới được tạo

## 5. Troubleshooting

### Lỗi: "CORS Error"
→ Đảm bảo backend worker.js có header `Access-Control-Allow-Origin: *`

### Lỗi: "Google Sign-In not working"
→ Kiểm tra:
1. VITE_GOOGLE_CLIENT_ID đã được set trong Netlify Environment Variables chưa
2. Domain hiện tại đã được thêm vào Google Console Authorized Origins chưa
3. Mở Console log xem có lỗi gì không

### Lỗi: "Database column email doesn't exist"
→ Chạy migration:
```bash
wrangler d1 execute tiem-truyen-nho-db --file=backend/migrations/add_email_column.sql --remote
```

### Web không hiển thị truyện
→ Kiểm tra:
1. VITE_API_URL trong Environment Variables đúng chưa
2. Backend worker đã deploy chưa
3. Database có dữ liệu chưa (nếu không có, sẽ hiển thị mock data)

## 6. Cập Nhật Code

### Cập nhật Frontend:
```bash
# Chỉ cần push lên GitHub, Netlify tự động deploy
git add .
git commit -m "Update feature"
git push origin main
```

### Cập nhật Backend:
```bash
# Copy code mới từ backend/worker.js
# Paste vào Cloudflare Dashboard → Edit code → Save and Deploy
```

## 7. Monitoring

### Netlify
- Xem build logs tại: Site settings → Deploys
- Xem analytics tại: Analytics tab

### Cloudflare
- Xem request logs tại: Workers → Your worker → Logs
- Xem usage tại: Workers → Analytics

## Notes

- Frontend build tự động mỗi khi push code lên GitHub (nếu đã kết nối Netlify)
- Backend cần deploy thủ công sau mỗi lần sửa code
- Database D1 chỉ có thể truy cập qua Cloudflare Dashboard hoặc wrangler CLI
