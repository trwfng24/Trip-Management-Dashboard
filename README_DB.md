# Database schema — DiDiEms

Tài liệu này mô tả schema PostgreSQL cho webapp quản lý chuyến đi dựa trên mockup hiện tại.

## Phạm vi và nguyên tắc

- Hiện tại chỉ có **leader mode**: một `user` sở hữu và quản lý nhiều `trip`.
- Member của trip chưa có tài khoản đăng nhập; chỉ lưu tên trong `trip_members`.
- Không lưu tên member làm khóa liên kết. Checklist và chi phí luôn tham chiếu `trip_members.id` để đổi tên không làm mất dữ liệu lịch sử.
- Khi member rời trip, đặt `is_active = false`; không xóa vật lý nếu member đã có dữ liệu liên quan.
- Mọi khóa chính dùng `uuid`, sinh bằng `gen_random_uuid()` từ extension `pgcrypto`.
- Mọi bảng nghiệp vụ có `created_at timestamptz` và `updated_at timestamptz`; backend cập nhật `updated_at` khi sửa dữ liệu.
- Tiền dùng `numeric(14,2)`, không dùng `float`.

## Quan hệ chính

```text
users 1 ─── N trips 1 ─── N trip_members
                    ├── N itinerary_activities
                    ├── N checklist_tasks ─── 1 trip_members (người phụ trách)
                    ├── N expenses ─── 1 trip_members (người thanh toán)
                    │              └── N expense_splits ─── 1 trip_members
                    ├── N documents
                    ├── N opinions ─── 1 trip_members
                    ├── N feedback_forms ─── N feedback_responses
                    └── N notifications
```

## Bảng `users`

Tài khoản leader đăng nhập và sở hữu các trip.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Định danh leader. |
| `email` | `citext` | unique, not null | Email đăng nhập, không phân biệt hoa/thường. Cần extension `citext`. |
| `password_hash` | `text` | nullable | Mật khẩu đã hash bằng Argon2/bcrypt; để `null` nếu dùng OAuth. |
| `display_name` | `varchar(120)` | not null | Tên hiển thị của leader. |
| `auth_provider` | `varchar(30)` | not null, default `'password'` | Ví dụ: `password`, `google`. |
| `provider_subject` | `varchar(255)` | nullable | ID người dùng từ OAuth provider. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo tài khoản. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật gần nhất. |

Indexes/ràng buộc bổ sung:

- `unique (auth_provider, provider_subject)` khi `provider_subject is not null`.
- Không bao giờ trả `password_hash` từ API.

## Bảng `trips`

Workspace của từng chuyến đi.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh trip. |
| `leader_id` | `uuid` | FK → `users.id`, not null | Leader sở hữu trip. |
| `name` | `varchar(200)` | not null | Tên chuyến đi. |
| `destination` | `varchar(200)` | not null | Điểm đến. |
| `start_date` | `date` | not null | Ngày khởi hành. |
| `end_date` | `date` | not null, check `end_date >= start_date` | Ngày kết thúc. |
| `status` | `varchar(30)` | not null, default `'draft'` | `draft`, `planning`, `confirmed`, `ongoing`, `completed`. |
| `budget_amount` | `numeric(14,2)` | not null, check `budget_amount >= 0` | Ngân sách dự kiến (VND). |
| `cover_image_url` | `text` | nullable | URL ảnh bìa từ object storage/CDN. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Indexes: `index (leader_id, start_date desc)` để lấy danh sách trip của leader.

## Bảng `trip_members`

Member thuộc một trip. Member chỉ có tên ở phiên bản hiện tại.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | ID bất biến của member. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip chứa member. |
| `display_name` | `varchar(120)` | not null | Tên hiển thị có thể đổi. |
| `is_active` | `boolean` | not null, default `true` | `false` khi member đã rời trip; vẫn giữ lịch sử. |
| `joined_at` | `timestamptz` | not null, default `now()` | Thời điểm được thêm vào trip. |
| `left_at` | `timestamptz` | nullable | Thời điểm rời trip. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Indexes/ràng buộc:

- `index (trip_id, is_active)` cho member picker.
- Không đặt `unique(trip_id, display_name)`: có thể có hai người trùng tên. UI nên cảnh báo để leader dễ phân biệt.

## Bảng `itinerary_activities`

Các hoạt động trong lịch trình theo ngày và thời gian.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh hoạt động. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip chứa hoạt động. |
| `activity_date` | `date` | not null | Ngày diễn ra. Backend cần kiểm tra thuộc khoảng ngày của trip. |
| `start_time` | `time` | nullable | Giờ bắt đầu. |
| `end_time` | `time` | nullable | Giờ kết thúc. |
| `title` | `varchar(200)` | not null | Tên hoạt động. |
| `note` | `text` | nullable | Ghi chú, địa điểm hoặc hướng dẫn. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, activity_date, start_time)`.

## Bảng `checklist_tasks`

Việc cần chuẩn bị cho trip.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh công việc. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip chứa công việc. |
| `assignee_member_id` | `uuid` | FK → `trip_members.id`, nullable | Member phụ trách; có thể bỏ gán. |
| `title` | `varchar(250)` | not null | Nội dung công việc. |
| `note` | `text` | nullable | Ghi chú. |
| `status` | `varchar(20)` | not null, default `'not_completed'`, check `status in ('not_completed', 'completed')` | Chỉ nhận `not_completed` (chưa hoàn thành) hoặc `completed` (hoàn thành). |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, status)`.

## Bảng `expenses`

Khoản chi của trip. Một khoản có một người thanh toán và nhiều người cùng chia.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh khoản chi. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip phát sinh khoản chi. |
| `paid_by_member_id` | `uuid` | FK → `trip_members.id`, nullable | Người đã thanh toán; giữ tham chiếu cả khi member inactive. |
| `title` | `varchar(250)` | not null | Tên khoản chi. |
| `amount` | `numeric(14,2)` | not null, check `amount > 0` | Tổng số tiền. |
| `expense_date` | `date` | not null | Ngày phát sinh. |
| `note` | `text` | nullable | Ghi chú. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, expense_date desc)`.

## Bảng `expense_splits`

Phần tiền mỗi member chịu trong một khoản chi. Không tự động sửa các dòng cũ khi thêm/xóa member.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh dòng phân bổ. |
| `expense_id` | `uuid` | FK → `expenses.id`, not null, on delete cascade | Khoản chi cha. |
| `member_id` | `uuid` | FK → `trip_members.id`, not null | Member chịu phần tiền này. |
| `share_amount` | `numeric(14,2)` | not null, check `share_amount >= 0` | Số tiền member phải trả. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Ràng buộc:

- `unique (expense_id, member_id)`.
- FastAPI phải kiểm tra `sum(expense_splits.share_amount) = expenses.amount` trong cùng transaction. Có thể dùng trigger PostgreSQL khi cần chặn cả thao tác SQL trực tiếp.

## Bảng `documents`

Metadata cho vé, booking, hóa đơn và tài liệu. File thật lưu ở Supabase Storage/S3/Cloudflare R2, không lưu blob trong PostgreSQL.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh tài liệu. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip sở hữu tài liệu. |
| `uploaded_by_user_id` | `uuid` | FK → `users.id`, not null | Leader tải tài liệu lên. |
| `name` | `varchar(255)` | not null | Tên tài liệu hiển thị. |
| `note` | `text` | nullable | Mô tả hoặc ghi chú. |
| `storage_key` | `varchar(500)` | unique, not null | Key/path file trong object storage. |
| `mime_type` | `varchar(100)` | nullable | Ví dụ `application/pdf`, `image/jpeg`. |
| `file_size_bytes` | `bigint` | nullable, check `file_size_bytes >= 0` | Kích thước file. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, created_at desc)`.

## Bảng `opinions`

Ý kiến/đề xuất của member trong mockup.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh ý kiến. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip chứa ý kiến. |
| `member_id` | `uuid` | FK → `trip_members.id`, nullable | Member gửi ý kiến; nullable khi nhập tay/ẩn danh. |
| `content` | `text` | not null | Nội dung ý kiến. |
| `status` | `varchar(20)` | not null, default `'pending'`, check `status in ('pending', 'approved')` | `pending` (chờ duyệt) hoặc `approved` (đã duyệt). |
| `approved_at` | `timestamptz` | nullable | Thời điểm leader duyệt. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, status, created_at desc)`.

## Bảng `feedback_forms`

Metadata form lấy ý kiến. Bảng này phục vụ tính năng Google Form mô phỏng trong mockup; có thể bỏ ở MVP nếu chỉ nhập opinion thủ công.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh form. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip liên quan. |
| `title` | `varchar(250)` | not null | Tiêu đề form. |
| `description` | `text` | nullable | Mô tả form. |
| `external_url` | `text` | nullable | URL Google Form thật nếu tích hợp ngoài. |
| `status` | `varchar(20)` | not null, default `'draft'` | `draft`, `open`, `closed`. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

## Bảng `feedback_responses`

Phản hồi nhận từ form hoặc do leader nhập lại. `answers` dùng JSONB vì câu hỏi form có thể thay đổi.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh phản hồi. |
| `form_id` | `uuid` | FK → `feedback_forms.id`, not null, on delete cascade | Form nhận phản hồi. |
| `member_id` | `uuid` | FK → `trip_members.id`, nullable | Người phản hồi nếu xác định được. |
| `respondent_name` | `varchar(120)` | nullable | Tên người phản hồi khi không map được member. |
| `answers` | `jsonb` | not null, default `'{}'::jsonb` | Cặp question/answer của form. |
| `submitted_at` | `timestamptz` | not null, default `now()` | Thời điểm gửi phản hồi. |

Index: `index (form_id, submitted_at desc)`.

## Bảng `notifications`

Thông báo nội bộ tổng quát cho leader. Luồng duyệt opinion hiện không tạo thông báo hay tự thêm hoạt động vào lịch trình.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh thông báo. |
| `user_id` | `uuid` | FK → `users.id`, not null | Leader nhận thông báo. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip liên quan. |
| `type` | `varchar(50)` | not null | Loại thông báo nghiệp vụ, ví dụ `trip_reminder`. |
| `title` | `varchar(250)` | not null | Tiêu đề hiển thị. |
| `body` | `text` | nullable | Nội dung chi tiết. |
| `is_read` | `boolean` | not null, default `false` | Đã xem/xử lý hay chưa. |
| `read_at` | `timestamptz` | nullable | Thời điểm đánh dấu đã xử lý. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |

Index: `index (user_id, is_read, created_at desc)`.

## Quy tắc backend cần bảo đảm

1. Leader chỉ được CRUD các trip có `trips.leader_id = current_user.id`.
2. Với mọi FK member (`assignee_member_id`, `paid_by_member_id`, `expense_splits.member_id`), backend phải kiểm tra member thuộc cùng trip. PostgreSQL FK đơn lẻ không tự đảm bảo điều này.
3. Khi đổi `trip_members.display_name`, không sửa FK; API chỉ trả tên mới khi join member theo ID.
4. Khi member bị inactive, không được chọn cho checklist/expense mới; nhưng vẫn hiển thị trong lịch sử và quyết toán.
5. Khi tạo/sửa expense, lưu `expenses` và toàn bộ `expense_splits` trong một transaction; tổng split phải bằng `amount`.
6. Không cho xóa vật lý trip khi đã có dữ liệu, trừ khi có luồng xóa cascade được xác nhận rõ ràng. MVP nên dùng `deleted_at timestamptz` trên `trips` nếu cần tính năng thùng rác.

## Thứ tự migration đề xuất

1. Bật `pgcrypto` và `citext`.
2. Tạo `users`, `trips`, `trip_members`.
3. Tạo `itinerary_activities`, `checklist_tasks`.
4. Tạo `expenses`, `expense_splits`.
5. Tạo `documents`, `opinions`, `feedback_forms`, `feedback_responses`, `notifications`.
6. Thêm indexes, check constraints, trigger `updated_at` và trigger/validation cho tổng `expense_splits`.
