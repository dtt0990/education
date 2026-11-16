# Cổng thông tin học tập · THANH

Website học tập cá nhân do giảng viên Đoàn Tuấn Thanh sở hữu và quản lý. Website được tổ chức theo cấu trúc nhiều trang, có sitemap và trang nội dung riêng cho từng môn học.

## 1. Cấu trúc website

- `index.html`: Trang chủ.
- `gioi-thieu.html`: Giới thiệu giảng viên, kinh nghiệm, hoạt động giảng dạy, nghiên cứu và đơn vị liên quan.
- `chuong-trinh.html`: Danh mục 5 môn học.
- `lien-he.html`: Điện thoại, Zalo và QR cá nhân.
- `so-do-website.html`: Sơ đồ điều hướng hiển thị cho người dùng.
- `mon-hoc/`: Trang riêng cho từng môn học.
  - `ai-tech/`: Tổng quan, đề cương, bài giảng, tài liệu tham khảo và hỗ trợ học viên là các trang riêng.
  - Bốn môn còn lại có trang riêng và thông báo tạm khóa cho đến khi nội dung được mở.
- `data/courses.json`: Dữ liệu nội dung, văn bản giao diện, hồ sơ, hình ảnh và môn học.
- `assets/css/portal.css`: Hệ thống giao diện, typography và responsive.
- `assets/js/portal.js`: Điều hướng và hiển thị nội dung.
- `assets/images/`: Logo, ảnh môn học, ảnh minh họa và QR Zalo.
- `fonts/`: Font Roboto tự lưu trữ, có hỗ trợ ký tự tiếng Việt.
- `admin.html`: Trình biên tập nội dung cục bộ; không đưa lên website công khai.

## 2. Sơ đồ môn học

Mỗi môn học có thể có các khu vực riêng:

1. Tổng quan môn học.
2. Đề cương môn học.
3. Nội dung bài giảng.
4. Tài liệu tham khảo.
5. Hỗ trợ học viên.

Hiện Môn 01 đang mở. Các môn còn lại hiển thị thông báo: “Nội dung hiện đang tạm khóa, liên hệ quản trị viên để mở.”

## 3. Quản trị và chỉnh sửa nội dung

Website là website tĩnh, phù hợp triển khai công khai trên GitHub Pages. Không cần API trả phí hoặc máy chủ backend.

1. Mở `admin.html` trên máy tính bằng Chrome hoặc Edge.
2. Chọn **Nhập JSON** và tải file `data/courses.json` hiện hành.
3. Chỉnh sửa thông tin cổng, hồ sơ giảng viên, nội dung giao diện hoặc từng môn học.
4. Có thể sửa toàn bộ dữ liệu trong tab **Toàn bộ dữ liệu JSON**.
5. Chọn **Xuất JSON cập nhật**.
6. Thay file `data/courses.json` trên GitHub bằng file vừa xuất.

Tất cả nội dung chữ và đường dẫn hình ảnh hiển thị được quản lý trong JSON. Có thể thay hình bằng cách nhập đường dẫn tương đối, ví dụ `assets/images/logo-truong.webp`, hoặc dùng trường tải ảnh trong trình biên tập để nhúng ảnh vào JSON. Nếu muốn repository gọn nhẹ, nên tải ảnh lên `assets/images/` rồi dùng đường dẫn tương đối.

Bố cục, màu sắc, font, khoảng cách và hiệu ứng được quản lý trong `assets/css/portal.css`; cấu trúc trang và logic điều hướng được quản lý trong `assets/js/portal.js` và các file HTML. Những thay đổi về thiết kế tổng thể cần chỉnh ở các file nguồn này.

## 4. Font chữ

Website sử dụng Roboto local với các mức 400, 500, 700 và 900. Các file font nằm trong `fonts/`; CSS gọi font từ đường dẫn tương đối để hoạt động trên GitHub Pages kể cả khi website được triển khai trong một repository con. Không cần tải Google Fonts từ mạng ngoài.

## 5. Đưa lên GitHub Pages

1. Giải nén gói Public.
2. Upload toàn bộ nội dung bên trong thư mục website lên thư mục gốc repository `education2026` (không upload thư mục bọc bên ngoài).
3. Commit vào nhánh `main`.
4. Vào **Settings → Pages**, chọn nhánh `main` và thư mục `/ (root)`.
5. Sau khi triển khai, kiểm tra các trang: Trang chủ, Giới thiệu, Chương trình học, Môn 01 và từng trang con.

Website đang được cấu hình theo URL hiện tại: `https://dtt0990.github.io/education2026/`. Nếu đổi tên repository hoặc domain, cần cập nhật `sitemap.xml` và `robots.txt`.

## 6. Lưu ý bảo mật và quyền truy cập

- Website công khai; tài liệu được liên kết công khai có thể được xem hoặc tải.
- Trạng thái “Tạm khóa” chỉ ẩn nội dung ở giao diện, không bảo vệ file nếu file gốc được đưa công khai lên repository.
- `admin.html` là công cụ biên tập chạy cục bộ, không phải hệ thống đăng nhập quản trị. Không đưa file này lên repository public.
- Chỉ đưa lên website những tài liệu mà giảng viên có quyền chia sẻ công khai; không đưa dữ liệu cá nhân của học viên hoặc tài liệu nội bộ lên repository public.
