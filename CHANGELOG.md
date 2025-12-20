# Nhật Ký Thay Đổi (Changelog)

## [2025-01-20] - Cập Nhật Giao Diện và Đăng Nhập Google

### Đã Sửa
1. **Trang Chủ (Home Page)**
   - Thay đổi từ message test đơn giản thành giao diện hiển thị danh sách truyện
   - Thêm banner "Tiệm Truyện Nhỏ" với gradient xanh dương
   - Thêm các tab: Xu hướng, Mới nhất, Đánh giá cao
   - Grid layout responsive hiển thị các StoryCard
   - Skeleton loading khi đang tải dữ liệu
   - Tự động fallback về mock data nếu API không có dữ liệu

2. **Đăng Nhập Google**
   - Tích hợp Google Identity Services (Google Sign-In button thật)
   - Xóa bỏ mock/giả lập Google login
   - Tự động parse JWT token từ Google để lấy thông tin user
   - Lưu thông tin: name, email, picture (avatar) vào database
   - Hỗ trợ localization tiếng Việt cho button Google

3. **Backend API**
   - Cập nhật endpoint `/api/sync-user` để nhận và lưu `email` từ Google
   - Đồng bộ code giữa `backend/worker.js` và `backend/src/index.ts`
   - Thêm migration SQL để thêm cột `email` vào bảng `users`

4. **Giao Diện**
   - Đổi màu chủ đạo từ indigo/purple sang blue/cyan (theo yêu cầu)
   - Cải thiện button và input styling với màu xanh dương
   - Đổi title trang từ "Youware App" thành "Tiệm Truyện Nhỏ"

### Đã Thêm
- File `.env.example` - Template cho cấu hình môi trường
- File `GOOGLE_LOGIN_SETUP.md` - Hướng dẫn setup Google OAuth chi tiết
- File `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy frontend & backend
- File `backend/migrations/add_email_column.sql` - Migration thêm cột email
- Script Google Identity Services trong `index.html`

### Cần Làm Tiếp
1. Lấy Google Client ID từ Google Console
2. Thêm vào file `.env` với key `VITE_GOOGLE_CLIENT_ID`
3. Deploy frontend lên Netlify (tự động khi push code)
4. Deploy backend lên Cloudflare Workers (copy paste `backend/worker.js`)
5. Chạy migration SQL để thêm cột email vào database D1

### Breaking Changes
- Không có breaking changes
- Tất cả tính năng cũ vẫn hoạt động bình thường
- Login bằng email/password vẫn hoạt động (mock mode cho testing)

### Files Changed
```
Modified:
- src/pages/Home.tsx
- src/components/LoginModal.tsx
- index.html
- backend/worker.js
- backend/src/index.ts

Added:
- .env.example
- GOOGLE_LOGIN_SETUP.md
- DEPLOYMENT_GUIDE.md
- CHANGELOG.md
- backend/migrations/add_email_column.sql
```

## Hướng Dẫn Sử Dụng

1. **Development:**
   ```bash
   npm install
   npm run dev
   ```

2. **Setup Google Login:**
   - Xem file `GOOGLE_LOGIN_SETUP.md`

3. **Deploy:**
   - Xem file `DEPLOYMENT_GUIDE.md`

4. **Database Migration:**
   ```bash
   wrangler d1 execute tiem-truyen-nho-db --file=backend/migrations/add_email_column.sql --remote
   ```
