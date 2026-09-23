# DiDiEms frontend

## Cài đặt

```sh
npm install
cp .env.example .env.local
npm run dev
```

Điền hai biến trong `.env.local` bằng URL dự án Supabase và publishable key của bạn:

```dotenv
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

## Supabase Auth

- Trong **Authentication → Providers**, bật Email và Google nếu dùng các cách đăng nhập tương ứng.
- Trong **Authentication → URL Configuration**, thêm URL local của Vite (thường là `http://localhost:5173`) vào **Redirect URLs**. URL production cũng phải được thêm tại đây.
- Khi đăng ký bằng email, ứng dụng hiển thị trạng thái xác nhận nếu Supabase yêu cầu xác thực email. Cấu hình mẫu email và URL redirect xác nhận thực hiện trong Supabase.

## Lệnh thường dùng

```sh
npm test
npm run build
```
