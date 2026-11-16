# Hướng dẫn cập nhật Cổng thông tin học tập · THANH

## Cập nhật nội dung

1. Mở `admin.html` trên máy tính bằng Chrome hoặc Edge.
2. Chọn **Nhập JSON** và mở `data/courses.json`.
3. Chọn tab **Cổng & giảng viên** để sửa tên cổng, nội dung trang chủ, hồ sơ, Viện kết nối, danh sách trường, Zalo và QR.
4. Chọn tab **Nội dung môn học** để sửa từng môn, bao gồm đề cương, slide, tài liệu tham khảo và hỗ trợ học viên.
5. Tab **Toàn bộ dữ liệu JSON** cho phép chỉnh sửa bất kỳ trường dữ liệu hoặc nội dung giao diện nào.
6. Chọn **Xuất JSON cập nhật** và thay file `data/courses.json` trên GitHub.

## Cập nhật hình ảnh và logo

- Tải ảnh lên thư mục `assets/images/` trong repository, sau đó cập nhật đường dẫn tương đối trong JSON, ví dụ `assets/images/logo-truong.webp`.
- Trong trình biên tập, có thể chọn file ảnh để nhúng trực tiếp vào JSON; nên tối ưu ảnh dưới 1,5 MB.
- Logo của các trường hiện để trống, chờ bổ sung. Các tên trường đã được cấu hình sẵn trong danh sách đơn vị.

## Cấu trúc trang môn học

Mỗi môn có năm trang riêng: Tổng quan, Đề cương, Bài giảng, Tài liệu tham khảo và Hỗ trợ học viên. Môn 01 đang mở. Các môn còn lại hiển thị thông báo tạm khóa ở tất cả các trang con.

## Lưu ý khi xuất bản

- Chỉ đưa nội dung public vào repository public.
- Không upload `admin.html` lên GitHub Pages.
- Trạng thái tạm khóa chỉ là khóa giao diện, không bảo vệ file được lưu công khai trong repository.
- Sau khi thay `data/courses.json`, cần commit thay đổi lên nhánh `main`.


## Cập nhật giao diện và hồ sơ giảng viên – 16/11/2026
- Đã cập nhật tên mục điều hướng thành “Giới thiệu”.
- Đã bổ sung nội dung “Góc nhìn của giảng viên” trong dữ liệu JSON; có thể chỉnh sửa trực tiếp tại `data/courses.json`, trường `portal.teacher.perspective`.
- Đã bổ sung khu vực công trình khoa học và bài báo công bố có trạng thái giới hạn quyền truy cập; chỉnh sửa tại `portal.teacher.publicationAccess`. Danh mục công trình chưa được tự tạo vì chưa có dữ liệu xác thực.
- Đã gắn logo cho bốn cơ sở giáo dục trong `portal.institutions`.
- Đã cập nhật màu sắc, gradient, nhịp chữ và khoảng cách nội dung.
