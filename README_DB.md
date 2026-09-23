# Database schema — DiDiEms

Tài liệu này mô tả schema PostgreSQL cho webapp quản lý chuyến đi dựa trên mockup hiện tại.

## Phạm vi và nguyên tắc

- Hiện tại chỉ có **leader mode**: một tài khoản Supabase Auth có một `profile`, sở hữu và quản lý nhiều `trip`.
- Dùng **Supabase Auth** cho đăng nhập email/mật khẩu và Google OAuth. Schema nghiệp vụ nằm trong `public`; schema `auth` do Supabase quản lý.
- Member của trip chưa có tài khoản đăng nhập; chỉ lưu tên trong `trip_members`.
- Không lưu tên member làm khóa liên kết. Checklist và chi phí luôn tham chiếu `trip_members.id` để đổi tên không làm mất dữ liệu lịch sử.
- Khi member rời trip, đặt `is_active = false`; không xóa vật lý nếu member đã có dữ liệu liên quan.
- Mọi khóa chính dùng `uuid`. Bảng nghiệp vụ sinh ID bằng `gen_random_uuid()`; riêng `profiles.id` lấy nguyên giá trị từ `auth.users.id`, không sinh UUID mới.
- Các bảng có `updated_at timestamptz` dùng trigger tự cập nhật khi sửa dữ liệu. `feedback_responses` dùng `submitted_at`; `notifications` chỉ có `created_at` và `read_at` theo mô tả bên dưới.
- Tiền dùng `numeric(14,2)`, không dùng `float`.

## Quan hệ chính

```text
auth.users 1 ─── 1 profiles
profiles   1 ─── N trips 1 ─── N trip_members
                    ├── N itinerary_activities
                    ├── N checklist_tasks ─── 1 trip_members (người phụ trách)
                    ├── N expenses ─── 1 trip_members (người thanh toán)
                    │              └── N expense_splits ─── 1 trip_members
                    ├── N documents
                    ├── N opinions ─── 1 trip_members
                    ├── N feedback_forms ─── N feedback_responses
                    └── N notifications
```

## Xác thực bằng Supabase Auth

- Supabase quản lý tài khoản, mật khẩu, OAuth và phiên đăng nhập trong schema `auth`. Không tạo bảng `public.users` để quản lý đăng nhập riêng, không tự thêm/sửa cấu trúc các bảng Auth.
- Không lưu `password_hash`, `auth_provider` hay `provider_subject` trong bảng nghiệp vụ. Email đăng nhập lấy qua Supabase Auth khi cần, không sao chép vào profile.
- `auth.users.id` là định danh tài khoản; `public.profiles.id` dùng cùng ID này để liên kết dữ liệu của leader.
- Tạo tài khoản qua Supabase Auth hoặc mục **Authentication → Users** để thử nghiệm; không tự insert tài khoản bằng SQL vào `auth.users`.
- Khi có frontend/backend, dùng access token của Supabase. Backend phải xác minh token trước khi lấy `sub` làm ID leader; không tin `user_id` do client gửi và không chỉ decode token.
- Member trong `trip_members` vẫn không có tài khoản Auth ở phiên bản hiện tại.

Tham khảo: [Quản lý dữ liệu user trong Supabase Auth](https://supabase.com/docs/guides/auth/managing-user-data).

## Cách chạy các đoạn SQL

Các block `SCHEMA` dùng cho project Supabase mới, chưa có các bảng của app. Chạy bằng role `postgres` trong SQL Editor hoặc DBeaver. Script dùng `create table`, không xóa/ghi đè bảng đã có; nếu đã tạo một phần schema thì phải kiểm tra và viết migration bổ sung thay vì chạy lại toàn bộ.

1. Gom block `SCHEMA: chuẩn bị`, các block `SCHEMA` dưới 12 bảng theo thứ tự tài liệu và block `SCHEMA: phân quyền` thành một query. Bọc query bằng `begin;` ở đầu và `commit;` ở cuối, rồi chạy. **Không gom các block `DEMO` vào query schema.** Nếu có lỗi, chạy `rollback;` trước khi sửa và thử lại.
2. Vào **Authentication → Users**, tạo tài khoản thử `leader.demo@example.com` qua **Add user → Create new user**. Dùng mật khẩu tự chọn trong dashboard; tài liệu không lưu mật khẩu. Nếu tài khoản đã có thì dùng tài khoản đó, trigger/backfill sẽ tạo profile.
3. Gom toàn bộ block `DEMO` theo thứ tự tài liệu vào một query riêng, bọc bằng `begin;` và `commit;`, rồi chạy một lần. Nếu dùng email khác, thay **mọi** chuỗi `leader.demo@example.com` trong query demo. UUID cố định chỉ dành cho bộ dữ liệu mẫu; chạy lại sẽ báo trùng khóa và transaction được rollback.
4. Chạy các query ở phần **Kiểm tra sau khi chạy**. File Storage, đăng nhập Google và backend/frontend chưa được cấu hình bởi các script này.

SQL chuẩn bị (chạy trước các bảng):

```sql
-- SCHEMA: chuẩn bị
create extension if not exists pgcrypto;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
```

## Bảng `profiles`

Thông tin hiển thị của leader. Tên đầy đủ là `public.profiles`; các tên bảng nghiệp vụ còn lại trong tài liệu cũng thuộc schema `public`.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id`, on delete cascade; không có default | ID của tài khoản leader do Supabase Auth cấp. |
| `display_name` | `varchar(120)` | not null | Tên hiển thị của leader. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo profile. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật gần nhất. |

Khởi tạo và vòng đời profile:

- Migration tạo trigger `after insert` trên `auth.users` để thêm một profile với `id = new.id`. Hàm trigger dùng `security definer`, `set search_path = ''` và tên bảng đầy đủ `public.profiles`.
- Lấy tên từ metadata `display_name`, `full_name` hoặc `name`; bỏ khoảng trắng đầu/cuối, giới hạn 120 ký tự và dùng `'Leader'` nếu không có tên hợp lệ. Metadata này chỉ dùng hiển thị, không quyết định quyền truy cập.
- Profile được tạo khi tài khoản Auth được tạo; việc được phép đăng nhập còn phụ thuộc cấu hình xác nhận email. Trigger phải hoạt động với cả email/mật khẩu và Google OAuth.
- Nếu đã có tài khoản trước khi cài trigger, backfill các profile còn thiếu theo `auth.users.id`; không ghi đè profile đã tồn tại.
- Client chỉ được xem và sửa tên của profile chính mình, không được đổi `id`, tự tạo hoặc xóa profile. Profile do trigger tạo, xóa qua luồng quản trị tài khoản.
- Các FK nghiệp vụ đến `profiles.id` dùng `on delete restrict` để giữ dữ liệu lịch sử. Vì vậy không xóa tài khoản Auth đang có trip/tài liệu/thông báo liên quan; phải xử lý dữ liệu và file Storage trước trong một luồng xóa tài khoản riêng.

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: profiles
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name varchar(120) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on table public.profiles from public, anon, authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        left(coalesce(
            nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
            nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
            nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
            'Leader'
        ), 120)
    );
    return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill các tài khoản đã có trước khi cài trigger.
insert into public.profiles (id, display_name)
select id, left(coalesce(
    nullif(btrim(raw_user_meta_data ->> 'display_name'), ''),
    nullif(btrim(raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(raw_user_meta_data ->> 'name'), ''),
    'Leader'
), 120)
from auth.users
on conflict (id) do nothing;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: profiles
-- Thay email này bằng email tài khoản thử nếu mày dùng email khác.
do $$
begin
    if not exists (select 1 from auth.users where email = 'leader.demo@example.com') then
        raise exception 'Hãy tạo leader.demo@example.com trong Authentication → Users trước';
    end if;
end;
$$;

-- Profile đã được trigger tạo; chỉ cập nhật tên, không insert auth.users.
update public.profiles
set display_name = 'Minh - Leader demo'
where id = (select id from auth.users where email = 'leader.demo@example.com');
```

## Bảng `trips`

Workspace của từng chuyến đi.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh trip. |
| `leader_id` | `uuid` | FK → `profiles.id`, not null, on delete restrict | Leader sở hữu trip. |
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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: trips
create table public.trips (
    id uuid primary key default gen_random_uuid(),
    leader_id uuid not null references public.profiles(id) on delete restrict,
    name varchar(200) not null,
    destination varchar(200) not null,
    start_date date not null,
    end_date date not null check (end_date >= start_date),
    status varchar(30) not null default 'draft'
        check (status in ('draft', 'planning', 'confirmed', 'ongoing', 'completed')),
    budget_amount numeric(14,2) not null check (budget_amount >= 0),
    cover_image_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.trips enable row level security;
revoke all on table public.trips from public, anon, authenticated;

create index idx_trips_leader_start_date
    on public.trips (leader_id, start_date desc);

create trigger set_trips_updated_at
before update on public.trips
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: trips
insert into public.trips
    (id, leader_id, name, destination, start_date, end_date, status, budget_amount)
values
    ('10000000-0000-0000-0000-000000000001', (select id from auth.users where email = 'leader.demo@example.com'),
     'Đà Nẵng cuối tuần', 'Đà Nẵng', '2026-10-16', '2026-10-18', 'planning', 5000000);
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: trip_members
create table public.trip_members (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    display_name varchar(120) not null,
    is_active boolean not null default true,
    joined_at timestamptz not null default now(),
    left_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.trip_members enable row level security;
revoke all on table public.trip_members from public, anon, authenticated;

create index idx_trip_members_trip_active
    on public.trip_members (trip_id, is_active);

create trigger set_trip_members_updated_at
before update on public.trip_members
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: trip_members
insert into public.trip_members (id, trip_id, display_name)
values
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Minh'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Lan');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: itinerary_activities
create table public.itinerary_activities (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    activity_date date not null,
    start_time time,
    end_time time,
    title varchar(200) not null,
    note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.itinerary_activities enable row level security;
revoke all on table public.itinerary_activities from public, anon, authenticated;

create index idx_itinerary_activities_trip_date_time
    on public.itinerary_activities (trip_id, activity_date, start_time);

create trigger set_itinerary_activities_updated_at
before update on public.itinerary_activities
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: itinerary_activities
insert into public.itinerary_activities
    (id, trip_id, activity_date, start_time, end_time, title, note)
values
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
     '2026-10-16', '08:00', '09:00', 'Ăn sáng', 'Gặp nhau tại quán gần khách sạn');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: checklist_tasks
create table public.checklist_tasks (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    assignee_member_id uuid references public.trip_members(id) on delete restrict,
    title varchar(250) not null,
    note text,
    status varchar(20) not null default 'not_completed'
        check (status in ('not_completed', 'completed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.checklist_tasks enable row level security;
revoke all on table public.checklist_tasks from public, anon, authenticated;

create index idx_checklist_tasks_trip_status
    on public.checklist_tasks (trip_id, status);

create index idx_checklist_tasks_assignee
    on public.checklist_tasks (assignee_member_id);

create trigger set_checklist_tasks_updated_at
before update on public.checklist_tasks
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: checklist_tasks
insert into public.checklist_tasks
    (id, trip_id, assignee_member_id, title, note, status)
values
    ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
     'Đặt phòng khách sạn', 'Phòng cho hai người', 'not_completed');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: expenses
create table public.expenses (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    paid_by_member_id uuid references public.trip_members(id) on delete restrict,
    title varchar(250) not null,
    amount numeric(14,2) not null check (amount > 0),
    expense_date date not null,
    note text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.expenses enable row level security;
revoke all on table public.expenses from public, anon, authenticated;

create index idx_expenses_trip_date
    on public.expenses (trip_id, expense_date desc);

create index idx_expenses_payer
    on public.expenses (paid_by_member_id);

create trigger set_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: expenses
insert into public.expenses
    (id, trip_id, paid_by_member_id, title, amount, expense_date, note)
values
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
     'Ăn trưa', 300000, '2026-10-16', 'Minh thanh toán, chia đều hai người');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: expense_splits
create table public.expense_splits (
    id uuid primary key default gen_random_uuid(),
    expense_id uuid not null references public.expenses(id) on delete cascade,
    member_id uuid not null references public.trip_members(id) on delete restrict,
    share_amount numeric(14,2) not null check (share_amount >= 0),
    unique (expense_id, member_id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.expense_splits enable row level security;
revoke all on table public.expense_splits from public, anon, authenticated;

create index idx_expense_splits_member
    on public.expense_splits (member_id);

create trigger set_expense_splits_updated_at
before update on public.expense_splits
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: expense_splits
insert into public.expense_splits (id, expense_id, member_id, share_amount)
values
    ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 150000),
    ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 150000);
```

## Bảng `documents`

Metadata cho vé, booking, hóa đơn và tài liệu. File thật lưu ở Supabase Storage/S3/Cloudflare R2, không lưu blob trong PostgreSQL.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh tài liệu. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip sở hữu tài liệu. |
| `uploaded_by_user_id` | `uuid` | FK → `profiles.id`, not null, on delete restrict | Leader tải tài liệu lên; ID trùng với tài khoản Supabase Auth. |
| `name` | `varchar(255)` | not null | Tên tài liệu hiển thị. |
| `note` | `text` | nullable | Mô tả hoặc ghi chú. |
| `storage_key` | `varchar(500)` | unique, not null | Key/path file trong object storage. |
| `mime_type` | `varchar(100)` | nullable | Ví dụ `application/pdf`, `image/jpeg`. |
| `file_size_bytes` | `bigint` | nullable, check `file_size_bytes >= 0` | Kích thước file. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |
| `updated_at` | `timestamptz` | not null, default `now()` | Thời điểm cập nhật. |

Index: `index (trip_id, created_at desc)`.

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: documents
create table public.documents (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    uploaded_by_user_id uuid not null references public.profiles(id) on delete restrict,
    name varchar(255) not null,
    note text,
    storage_key varchar(500) not null unique,
    mime_type varchar(100),
    file_size_bytes bigint check (file_size_bytes >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;
revoke all on table public.documents from public, anon, authenticated;

create index idx_documents_trip_created
    on public.documents (trip_id, created_at desc);

create index idx_documents_uploader
    on public.documents (uploaded_by_user_id);

create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: documents
-- Đây chỉ là metadata mẫu; script không tải file thật lên Storage.
insert into public.documents
    (id, trip_id, uploaded_by_user_id, name, note, storage_key, mime_type, file_size_bytes)
values
    ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', (select id from auth.users where email = 'leader.demo@example.com'),
     'Booking khách sạn demo', 'File giả để thử giao diện',
     'demo/da-nang/booking-demo.pdf', 'application/pdf', 2048);
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: opinions
create table public.opinions (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    member_id uuid references public.trip_members(id) on delete restrict,
    content text not null,
    status varchar(20) not null default 'pending'
        check (status in ('pending', 'approved')),
    approved_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.opinions enable row level security;
revoke all on table public.opinions from public, anon, authenticated;

create index idx_opinions_trip_status_created
    on public.opinions (trip_id, status, created_at desc);

create index idx_opinions_member
    on public.opinions (member_id);

create trigger set_opinions_updated_at
before update on public.opinions
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: opinions
insert into public.opinions (id, trip_id, member_id, content, status)
values
    ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002',
     'Mình muốn ghé biển Mỹ Khê buổi chiều', 'pending');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: feedback_forms
create table public.feedback_forms (
    id uuid primary key default gen_random_uuid(),
    trip_id uuid not null references public.trips(id) on delete restrict,
    title varchar(250) not null,
    description text,
    external_url text,
    status varchar(20) not null default 'draft'
        check (status in ('draft', 'open', 'closed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.feedback_forms enable row level security;
revoke all on table public.feedback_forms from public, anon, authenticated;

create index idx_feedback_forms_trip
    on public.feedback_forms (trip_id);

create trigger set_feedback_forms_updated_at
before update on public.feedback_forms
for each row execute function public.set_updated_at();
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: feedback_forms
insert into public.feedback_forms (id, trip_id, title, description, status)
values
    ('90000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Góp ý lịch trình',
     'Form demo, chưa tích hợp Google Form', 'open');
```

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

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: feedback_responses
create table public.feedback_responses (
    id uuid primary key default gen_random_uuid(),
    form_id uuid not null references public.feedback_forms(id) on delete cascade,
    member_id uuid references public.trip_members(id) on delete restrict,
    respondent_name varchar(120),
    answers jsonb not null default '{}'::jsonb,
    submitted_at timestamptz not null default now()
);

alter table public.feedback_responses enable row level security;
revoke all on table public.feedback_responses from public, anon, authenticated;

create index idx_feedback_responses_form_submitted
    on public.feedback_responses (form_id, submitted_at desc);

create index idx_feedback_responses_member
    on public.feedback_responses (member_id);
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: feedback_responses
insert into public.feedback_responses
    (id, form_id, member_id, respondent_name, answers)
values
    ('a0000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Lan',
     '{"preferred_activity": "Đi biển", "meal_preference": "Hải sản"}'::jsonb);
```

## Bảng `notifications`

Thông báo nội bộ tổng quát cho leader. Luồng duyệt opinion hiện không tạo thông báo hay tự thêm hoạt động vào lịch trình.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `uuid` | PK | Định danh thông báo. |
| `user_id` | `uuid` | FK → `profiles.id`, not null, on delete restrict | Leader nhận thông báo; ID trùng với tài khoản Supabase Auth. |
| `trip_id` | `uuid` | FK → `trips.id`, not null | Trip liên quan. |
| `type` | `varchar(50)` | not null | Loại thông báo nghiệp vụ, ví dụ `trip_reminder`. |
| `title` | `varchar(250)` | not null | Tiêu đề hiển thị. |
| `body` | `text` | nullable | Nội dung chi tiết. |
| `is_read` | `boolean` | not null, default `false` | Đã xem/xử lý hay chưa. |
| `read_at` | `timestamptz` | nullable | Thời điểm đánh dấu đã xử lý. |
| `created_at` | `timestamptz` | not null, default `now()` | Thời điểm tạo. |

Index: `index (user_id, is_read, created_at desc)`.

SQL tạo bảng (chạy trong giai đoạn schema):

```sql
-- SCHEMA: notifications
create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete restrict,
    trip_id uuid not null references public.trips(id) on delete restrict,
    type varchar(50) not null,
    title varchar(250) not null,
    body text,
    is_read boolean not null default false,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
revoke all on table public.notifications from public, anon, authenticated;

create index idx_notifications_user_read_created
    on public.notifications (user_id, is_read, created_at desc);

create index idx_notifications_trip
    on public.notifications (trip_id);
```

Giá trị mẫu (chỉ chạy sau khi hoàn tất schema và tạo tài khoản Auth thử):

```sql
-- DEMO: notifications
insert into public.notifications (id, user_id, trip_id, type, title, body)
values
    ('b0000000-0000-0000-0000-000000000001', (select id from auth.users where email = 'leader.demo@example.com'), '10000000-0000-0000-0000-000000000001',
     'trip_reminder', 'Kiểm tra kế hoạch Đà Nẵng', 'Nhớ hoàn tất checklist trước ngày đi');
```

## Phân quyền với Supabase RLS

Các quy tắc dưới đây cần được triển khai trong migration cùng schema, trước khi cho ứng dụng truy cập dữ liệu qua Data API.

- Bật RLS trên `profiles` và mọi bảng nghiệp vụ trong `public`. Không cấp quyền truy cập dữ liệu cho role `anon` ở phiên bản leader mode.
- `profiles`: role `authenticated` chỉ được select profile có `id = auth.uid()` và update cột `display_name` của chính mình. Kết hợp policy với quyền update theo cột để không cho sửa ID hoặc timestamps.
- `trips`: quyền truy cập dựa trên `leader_id = auth.uid()`. Policy update phải kiểm tra cả dòng hiện tại (`using`) và dòng sau cập nhật (`with check`) để không thể chuyển trip sang leader khác.
- Các bảng có `trip_id`: kiểm tra trip tương ứng thuộc leader đang đăng nhập, với cả dòng hiện tại và dòng mới khi cập nhật.
- `expense_splits`: kiểm tra quyền qua `expenses → trips`; `feedback_responses`: kiểm tra qua `feedback_forms → trips`.
- `documents` còn phải có `uploaded_by_user_id = auth.uid()` khi thêm/sửa. `notifications` kiểm tra cả `user_id = auth.uid()` và quyền sở hữu trip.
- RLS xác định quyền sở hữu; vẫn cần validation/constraints cho các quy tắc nghiệp vụ như member cùng trip hoặc tổng tiền chia.
- Kết nối DBeaver bằng role `postgres` hoặc truy cập bằng `service_role` không phải cách kiểm chứng quyền của leader vì các role này có thể bỏ qua RLS. Kiểm tra phân quyền bằng hai tài khoản Auth khác nhau qua role `authenticated`.
- Kết nối PostgreSQL trực tiếp từ backend không tự mang danh tính Supabase Auth. Nếu backend dùng role bỏ qua RLS, backend phải xác minh token và tự áp dụng đầy đủ kiểm tra quyền; không mặc định cho rằng RLS đã bảo vệ truy vấn đó.

Tham khảo: [Row Level Security trong Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).


SQL phân quyền (chạy sau khi đã tạo tất cả bảng):

```sql
-- SCHEMA: phân quyền
grant usage on schema public to authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;

create policy profiles_select_own on public.profiles
for select to authenticated
using (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

grant select, insert, update, delete on table public.trips to authenticated;

create policy trips_manage_own on public.trips
for all to authenticated
using (leader_id = (select auth.uid()))
with check (leader_id = (select auth.uid()));

-- Bảng con kiểm tra quyền sở hữu qua trips.
do $$
declare
    table_name text;
    owner_check text;
begin
    foreach table_name in array array[
        'trip_members', 'itinerary_activities', 'checklist_tasks',
        'expenses', 'opinions', 'feedback_forms', 'documents', 'notifications'
    ] loop
        owner_check := format(
            'exists (select 1 from public.trips t where t.id = %I.trip_id and t.leader_id = (select auth.uid()))',
            table_name
        );
        if table_name = 'documents' then
            owner_check := owner_check || ' and uploaded_by_user_id = (select auth.uid())';
        elsif table_name = 'notifications' then
            owner_check := owner_check || ' and user_id = (select auth.uid())';
        end if;

        execute format(
            'grant select, insert, update, delete on table public.%I to authenticated',
            table_name
        );
        execute format(
            'create policy %I on public.%I for all to authenticated using (%s) with check (%s)',
            table_name || '_manage_own', table_name, owner_check, owner_check
        );
    end loop;
end;
$$;

grant select, insert, update, delete on table public.expense_splits to authenticated;

create policy expense_splits_manage_own on public.expense_splits
for all to authenticated
using (exists (
    select 1 from public.expenses e
    join public.trips t on t.id = e.trip_id
    where e.id = expense_splits.expense_id and t.leader_id = (select auth.uid())
))
with check (exists (
    select 1 from public.expenses e
    join public.trips t on t.id = e.trip_id
    where e.id = expense_splits.expense_id and t.leader_id = (select auth.uid())
));

grant select, insert, update, delete on table public.feedback_responses to authenticated;

create policy feedback_responses_manage_own on public.feedback_responses
for all to authenticated
using (exists (
    select 1 from public.feedback_forms f
    join public.trips t on t.id = f.trip_id
    where f.id = feedback_responses.form_id and t.leader_id = (select auth.uid())
))
with check (exists (
    select 1 from public.feedback_forms f
    join public.trips t on t.id = f.trip_id
    where f.id = feedback_responses.form_id and t.leader_id = (select auth.uid())
));
```

## Quy tắc backend cần bảo đảm khi triển khai

1. Xác minh access token Supabase và lấy `current_user.id` từ `sub`. Leader chỉ được CRUD các trip có `trips.leader_id = current_user.id`, cũng là `profiles.id` của leader.
2. Với mọi FK member (`assignee_member_id`, `paid_by_member_id`, `expense_splits.member_id`), backend phải kiểm tra member thuộc cùng trip. PostgreSQL FK đơn lẻ không tự đảm bảo điều này.
3. Khi đổi `trip_members.display_name`, không sửa FK; API chỉ trả tên mới khi join member theo ID.
4. Khi member bị inactive, không được chọn cho checklist/expense mới; nhưng vẫn hiển thị trong lịch sử và quyết toán.
5. Khi tạo/sửa expense, lưu `expenses` và toàn bộ `expense_splits` trong một transaction; tổng split phải bằng `amount`.
6. Không cho xóa vật lý trip khi đã có dữ liệu, trừ khi có luồng xóa cascade được xác nhận rõ ràng. MVP nên dùng `deleted_at timestamptz` trên `trips` nếu cần tính năng thùng rác.

## Thứ tự migration đề xuất

1. Bật `pgcrypto` nếu cần. Không cần `citext` cho schema hiện tại vì email do Supabase Auth quản lý; không tạo lại các bảng trong schema `auth`.
2. Tạo `profiles`, trigger tạo profile từ `auth.users` và backfill tài khoản đã có; sau đó tạo `trips`, `trip_members`.
3. Tạo `itinerary_activities`, `checklist_tasks`.
4. Tạo `expenses`, `expense_splits`.
5. Tạo `documents`, `opinions`, `feedback_forms`, `feedback_responses`, `notifications`.
6. Thêm indexes, check constraints, trigger `updated_at` và trigger/validation cho tổng `expense_splits`.
7. Bật RLS, cấp quyền tối thiểu và tạo policies cho `profiles` cùng mọi bảng nghiệp vụ; kiểm tra hai leader không truy cập được dữ liệu của nhau.

## Kiểm tra sau khi chạy

Các query sau chạy bằng role `postgres` để kiểm tra schema và dữ liệu mẫu:

```sql
-- CHECK: dữ liệu mẫu
select p.id, p.display_name, u.email
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'leader.demo@example.com';

select t.name, t.destination, m.display_name
from public.trips t
join public.trip_members m on m.trip_id = t.id
where t.id = '10000000-0000-0000-0000-000000000001';

-- Kết quả mong đợi: amount = 300000, total_split = 300000, balanced = true.
select e.title, e.amount, coalesce(sum(s.share_amount), 0) as total_split,
       e.amount = coalesce(sum(s.share_amount), 0) as balanced
from public.expenses e
left join public.expense_splits s on s.expense_id = e.id
where e.id = '50000000-0000-0000-0000-000000000001'
group by e.id;

-- Kết quả mong đợi: 12 bảng, tất cả rls_enabled = true.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
  and c.relname in (
      'profiles', 'trips', 'trip_members', 'itinerary_activities',
      'checklist_tasks', 'expenses', 'expense_splits', 'documents',
      'opinions', 'feedback_forms', 'feedback_responses', 'notifications'
  )
order by c.relname;
```

Để kiểm tra RLS ngay khi chưa có frontend, tạo thêm tài khoản `leader.other@example.com` trong Authentication. Query dưới đây dùng quyền quản trị để mô phỏng `sub` của tài khoản khác trong transaction, sau đó chạy select dưới role `authenticated`; không phải cách xác minh JWT cho ứng dụng thật.

```sql
-- CHECK: leader khác không đọc được trip mẫu
begin;

do $$
begin
    if not exists (select 1 from auth.users where email = 'leader.other@example.com') then
        raise exception 'Hãy tạo leader.other@example.com trong Authentication → Users trước';
    end if;
end;
$$;

select set_config('request.jwt.claims', json_build_object(
    'sub', (select id from auth.users where email = 'leader.other@example.com'),
    'role', 'authenticated'
)::text, true);

set local role authenticated;

-- Kết quả mong đợi: 0 dòng.
select * from public.trips
where id = '10000000-0000-0000-0000-000000000001';

rollback;
```

**Phạm vi validation:** SQL hiện thực các khóa ngoại, check constraints, timestamps và RLS nêu trên. Các kiểm tra member thuộc cùng trip, member còn active khi được gán mới, ngày hoạt động thuộc khoảng ngày trip và tổng `expense_splits` bằng `expenses.amount` vẫn cần backend hoặc trigger bổ sung. Bộ dữ liệu mẫu đã tuân thủ các quy tắc đó; query `balanced` chỉ kiểm tra, không tự chặn dữ liệu sai.
