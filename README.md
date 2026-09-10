# TripPilot — Trip Management Dashboard

## Tổng quan dự án

TripPilot là bản mockup dashboard hỗ trợ leader quản lý chuyến đi nhóm tại một nơi. Ứng dụng tập trung vào việc lập kế hoạch, thu thập ý kiến thành viên, theo dõi checklist, quản lý chi phí, lưu tài liệu và xuất thông tin chuyến đi.

Phiên bản hiện tại là giao diện demo chạy trực tiếp trên trình duyệt. Dữ liệu được lưu tạm trong JavaScript, chưa kết nối backend hoặc cơ sở dữ liệu.

## Các tính năng theo từng màn hình

### Đăng nhập

- Màn hình đăng nhập mô phỏng bằng email/mật khẩu hoặc Google.
- Có thể dùng thông tin bất kỳ để truy cập bản demo.

### Overview

- Hiển thị thông tin tổng quan của chuyến đi đang chọn: điểm đến, ngày đi, số thành viên, ngân sách và chi phí đã dùng.
- Hiển thị timeline các hoạt động sắp tới.
- Hiển thị tiến độ checklist chuẩn bị.
- Cho phép chỉnh sửa thông tin chuyến đi, gồm tên, địa điểm, ảnh, thành viên, ngày đi, ngân sách và trạng thái.

### Tất cả chuyến đi

- Xem danh sách các trip đã tạo.
- Tạo workspace cho chuyến đi mới.
- Chuyển sang workspace của từng chuyến đi.

### Opinions

- Hiển thị ý kiến và bình chọn mẫu từ các thành viên.
- Leader có thể duyệt ý kiến hoặc áp dụng hoạt động được bình chọn vào kế hoạch.

### Plan

- Hiển thị lịch trình theo ngày và khung giờ.
- Thêm, sửa hoặc xóa hoạt động trong kế hoạch.

### Checklist

- Theo dõi các công việc cần chuẩn bị.
- Gán người phụ trách và đánh dấu công việc đã hoàn thành.
- Thêm, sửa hoặc xóa checklist.

### Expenses

- Theo dõi các khoản chi của chuyến đi.
- Hiển thị tổng chi, người đã thanh toán và số tiền cần hoàn lại.
- Thêm, sửa hoặc xóa khoản chi mẫu.

### Documents

- Lưu danh sách vé, booking, hóa đơn và tài liệu liên quan.
- Thêm, sửa hoặc xóa tài liệu mẫu.

### Export

- Cung cấp các lựa chọn xuất PDF mô phỏng cho kế hoạch, checklist và báo cáo chi phí.
