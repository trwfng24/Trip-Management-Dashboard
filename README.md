# DiDiEms — Trip Management Dashboard

DiDiEms là mockup web quản lý chuyến đi nhóm. Ứng dụng gom việc lập kế hoạch, phối hợp thành viên, theo dõi chi phí và lưu tài liệu vào từng workspace chuyến đi.

> Đây là bản demo giao diện chạy hoàn toàn trên trình duyệt. Dữ liệu là dữ liệu mẫu trong JavaScript, chưa có backend, cơ sở dữ liệu hay xác thực thật.

## Chức năng

### Tài khoản

- Đăng ký tài khoản demo bằng họ tên, email và mật khẩu.
- Đăng nhập bằng email/mật khẩu hoặc lựa chọn đăng nhập Google mô phỏng.
- Đăng xuất và chuyển lại màn hình đăng nhập.

### Quản lý chuyến đi

- Xem danh sách tất cả chuyến đi dưới dạng các workspace riêng.
- Tạo chuyến đi với tên, điểm đến, thành viên, ngày khởi hành/kết thúc, trạng thái, ngân sách và ảnh bìa.
- Chỉnh sửa thông tin workspace đang mở.
- Chuyển nhanh giữa các chuyến đi từ danh sách hoặc thẻ chuyến đi.
- Theo dõi trạng thái: Bản nháp, Đang lên kế hoạch, Đã chốt, Đang diễn ra và Đã hoàn tất.

### Tổng quan

- Hiển thị điểm đến, thời gian, số thành viên, ngân sách và chi phí hiện tại.
- Theo dõi tiến độ checklist và các hoạt động sắp tới trên timeline.
- Hiển thị thông báo về các ý kiến đã duyệt nhưng chưa đưa vào lịch trình.

### Ý kiến thành viên

- Xem ý kiến/bình chọn mẫu từ thành viên.
- Duyệt ý kiến.
- Duyệt và đưa hoạt động được đề xuất vào lịch trình.
- Tạo Google Form mô phỏng, xem phản hồi và quản lý biểu mẫu ngay trong giao diện demo.

### Lịch trình (Plan)

- Xem hoạt động theo từng ngày của chuyến đi.
- Thêm hoạt động với thời gian, tiêu đề và ghi chú.
- Xem chi tiết, chỉnh sửa hoặc xóa hoạt động.

### Checklist chuẩn bị

- Theo dõi danh sách việc cần chuẩn bị và trạng thái hoàn thành.
- Gán người phụ trách và thêm ghi chú cho từng việc.
- Thêm, sửa hoặc xóa công việc.

### Chi phí và quyết toán

- Ghi nhận khoản chi, số tiền, người thanh toán và các thành viên cùng chia.
- Xem tổng chi, ngân sách còn lại và danh sách chi phí.
- Thêm, sửa hoặc xóa khoản chi.
- Tự động tổng hợp phần chi phí được phân bổ, số đã chi và số tiền mỗi thành viên cần trả/nhận lại.

### Tài liệu

- Quản lý danh sách vé, booking, hóa đơn và tài liệu liên quan.
- Thêm, chỉnh sửa hoặc xóa tài liệu.
- Đính kèm ảnh minh họa từ máy tính trong phiên làm việc hiện tại.

### Xuất báo cáo

- Chọn nội dung cần xuất: lịch trình, checklist, chi phí và quyết toán thành viên.
- Xem trước bản báo cáo dạng PDF trong trình duyệt và dùng hộp thoại in để lưu PDF.
- Tài liệu booking nhạy cảm không được chọn kèm theo mặc định.

## Cách chạy mockup

Không cần cài đặt dependency. Mở trực tiếp file sau bằng trình duyệt:

```text
mockup/index.html
```

Hoặc dùng một local server tĩnh nếu trình duyệt hoặc môi trường phát triển của bạn yêu cầu.

## Giới hạn của bản demo

- Dữ liệu không được lưu bền vững khi tải lại trang.
- Đăng nhập, Google Form và xuất PDF đều là mô phỏng phía client.
- Ảnh bìa/tài liệu tải lên được dùng bằng URL tạm thời của trình duyệt.
