# THANH V3 – Bản xem và chỉnh sửa trực tiếp

## Mở bản xem
1. Giải nén gói ZIP nếu sử dụng gói đầy đủ.
2. Mở `THANH_V3_PREVIEW_EDITABLE.html` bằng Chrome hoặc Edge. File này đã gói sẵn dữ liệu, giao diện, font và hình ảnh nên có thể mở độc lập.
3. Chọn **Chỉnh sửa trực tiếp**. Bấm vào đoạn chữ để sửa; bấm vào hình ảnh/logo để thay ảnh.
4. Chọn **Lưu bản nháp** để lưu trên trình duyệt hiện tại hoặc **Xuất JSON** để tải dữ liệu đã sửa.
5. Để cập nhật website công khai, thay `data/courses.json` bằng JSON đã xuất và triển khai lại bộ mã nguồn.

## Lưu ý
- Đây là bản xem/biên tập cục bộ; không tự ghi dữ liệu lên hosting hoặc GitHub.
- Bản nháp trong trình duyệt được lưu bằng localStorage trên thiết bị/trình duyệt hiện tại.
- Hình ảnh tải lên trực tiếp được nhúng vào JSON; nên dùng ảnh tối ưu, tối đa 2 MB mỗi ảnh.
- Một số nhãn dùng chung hoặc thành phần điều hướng phức tạp không mở chế độ sửa trực tiếp để tránh làm hỏng liên kết; có thể chỉnh chúng qua `admin.html` hoặc JSON.
