# Cổng thông tin học tập · THANH (V3)

Website học tập cá nhân của giảng viên Đoàn Tuấn Thanh. Đây là bộ mã nguồn **sẵn sàng triển khai trên GitHub Pages**; không cần build, backend hoặc API trả phí.

## Cấu trúc

- `index.html`: Trang chủ.
- `gioi-thieu.html`: Giới thiệu giảng viên.
- `chuong-trinh.html`: Danh mục chương trình học.
- `lien-he.html`: Thông tin liên hệ.
- `so-do-website.html`: Sơ đồ website.
- `mon-hoc/`: Trang tổng quan và các trang con của từng môn học.
- `data/courses.json`: Dữ liệu nội dung website.
- `assets/css/portal.css`: Giao diện, bố cục, responsive và hiệu ứng.
- `assets/js/portal.js`: Logic hiển thị và điều hướng.
- `assets/images/`: Logo, ảnh minh họa, ảnh môn học và QR.
- `fonts/`: Font Roboto tự lưu trữ.
- `THANH_V3_PREVIEW_EDITABLE.html`: Bản xem độc lập, có thể chỉnh sửa trực tiếp trên giao diện.
- `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`: Các tệp hỗ trợ triển khai và lập chỉ mục.

## Đưa website lên GitHub Pages

1. Giải nén ZIP này.
2. Mở repository GitHub sẽ dùng để xuất bản website.
3. Upload **toàn bộ nội dung bên trong ZIP** vào thư mục gốc của repository. Không upload một thư mục bọc bên ngoài.
4. Commit các tệp lên nhánh `main`.
5. Vào **Settings → Pages**.
6. Trong **Build and deployment**, chọn **Deploy from a branch**.
7. Chọn branch `main`, folder `/(root)`, rồi nhấn **Save**.
8. Đợi GitHub Pages triển khai xong. Nếu repository là `education2026` dưới tài khoản `dtt0990`, địa chỉ website dự kiến là `https://dtt0990.github.io/education2026/`.

Trang website chính nằm ở `/`. Bản xem chỉnh sửa trực tiếp có thể mở riêng tại `/THANH_V3_PREVIEW_EDITABLE.html`; trang này không nằm trong menu chính.

## Chỉnh sửa nội dung

Có hai cách:

### A. Chỉnh sửa trực tiếp trên bản Preview

1. Mở `THANH_V3_PREVIEW_EDITABLE.html` bằng Chrome hoặc Edge (hoặc mở URL tương ứng sau khi GitHub Pages triển khai).
2. Chọn **Chỉnh sửa trực tiếp** rồi bấm vào phần chữ hoặc hình ảnh cần thay đổi.
3. Chọn **Lưu bản nháp** để lưu trên trình duyệt hiện tại, hoặc **Xuất JSON** để tải dữ liệu đã sửa.
4. Muốn cập nhật website chính, thay `data/courses.json` bằng JSON vừa xuất rồi commit/push lên GitHub.

Bản Preview không tự ghi thay đổi lên repository hoặc website công khai. Nó chỉ lưu bản nháp trong trình duyệt và xuất JSON khi người dùng chủ động yêu cầu.

### B. Chỉnh sửa mã nguồn

- Nội dung văn bản, thông tin môn học, đường dẫn tài liệu và hình ảnh được quản lý trong `data/courses.json`.
- Giao diện và hiệu ứng được quản lý trong `assets/css/portal.css`.
- Cấu trúc trang và chức năng được quản lý trong `assets/js/portal.js` và các tệp HTML.
- Khi cập nhật, thay đúng tệp trong repository rồi commit/push lại.

Bộ biên tập quản trị cục bộ `admin.html` được giữ trong gói FULL KIT riêng, không đưa vào website công khai.

## Lưu ý trước khi xuất bản

- GitHub Pages là website công khai. Mọi nội dung trong `data/courses.json`, hình ảnh và tài liệu được commit lên repository đều có thể được người khác truy cập.
- Trạng thái “Tạm khóa” chỉ ẩn nội dung ở giao diện; không phải cơ chế bảo mật. Không commit tài liệu nội bộ, dữ liệu cá nhân học viên hoặc nội dung chưa được phép công khai.
- Bản Preview Editable chỉ chỉnh sửa bản xem trong trình duyệt, không có quyền ghi lên GitHub và không thay đổi website chính.
- Gói này đã giữ cấu trúc đường dẫn tương đối và `.nojekyll` để tương thích với GitHub Pages khi chạy ở repository con.
- `sitemap.xml` và `robots.txt` đang cấu hình theo `https://dtt0990.github.io/education2026/`. Nếu đổi tài khoản, tên repository hoặc domain, cần cập nhật hai tệp này.

## Giấy phép font

Font Roboto được lưu cục bộ trong `fonts/`; giấy phép Apache 2.0 đi kèm tại `fonts/Roboto-LICENSE-Apache-2.0.txt`.


## Dữ liệu đã cập nhật

- Nội dung `data/courses.json` đã đồng bộ với tệp JSON chỉnh sửa mới nhất do giảng viên cung cấp ngày 16/11/2026.
- Bản xem `THANH_V3_PREVIEW_EDITABLE.html` cũng đã được tạo lại từ chính dữ liệu này.
- Khóa lưu nháp của bản xem đã nâng lên V4 để không nạp lại bản nháp V3 cũ từ trình duyệt.
