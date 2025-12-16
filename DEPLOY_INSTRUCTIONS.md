# Hướng Dẫn Đưa Ứng Dụng Lên Mạng (Deploy)

Chúc mừng bạn! Code của bạn đã được lưu an toàn trên GitHub. Bây giờ là bước cuối cùng để đưa nó "lên sóng" cho mọi người cùng xem.

## Phần 1: Đưa giao diện lên Netlify (Frontend)

1.  Truy cập [Netlify.com](https://www.netlify.com/) và đăng nhập.
2.  Bấm nút **"Add new site"** -> Chọn **"Import from an existing project"**.
3.  Chọn **GitHub**.
4.  Tìm và chọn kho chứa (repository) **Tiệm Truyện Nhỏ** của bạn.
5.  Ở phần **Build settings**, điền như sau (thường Netlify tự điền đúng):
    *   **Base directory**: (để trống)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
6.  Bấm **"Deploy site"**.

## Phần 2: Đưa máy chủ lên Cloudflare (Backend)

*Lưu ý: Phần này hơi phức tạp hơn một chút.*

1.  Truy cập [Cloudflare Dash](https://dash.cloudflare.com/) -> Chọn **Workers & Pages**.
2.  Bấm **"Create Application"** -> **"Create Worker"**.
3.  Đặt tên là `tiem-truyen-backend` -> Bấm **Deploy**.
4.  Sau khi tạo xong, bấm vào **"Edit Code"** (hoặc "Quick Edit").
5.  **QUAN TRỌNG:**
    *   Quay lại YouWare, mở file `backend/src/index.ts`.
    *   Copy **toàn bộ** nội dung file đó.
    *   Dán đè vào trình sửa code của Cloudflare.
6.  Bấm **"Save and Deploy"**.
7.  Copy đường link của Worker (ví dụ: `https://tiem-truyen-backend.user.workers.dev`).

## Phần 3: Kết nối 2 phần với nhau

1.  Quay lại **Netlify** (nơi bạn để giao diện).
2.  Vào **Site configuration** -> **Environment variables**.
3.  Bấm **"Add a variable"**:
    *   Key: `VITE_API_URL`
    *   Value: (Dán đường link Cloudflare Worker bạn vừa copy ở Phần 2)
4.  Vào mục **Deploys** -> Bấm **"Trigger deploy"** -> **"Deploy site"** để cập nhật lại.

---
**Xong!** Bây giờ ứng dụng của bạn đã chạy hoàn chỉnh trên mạng internet.
