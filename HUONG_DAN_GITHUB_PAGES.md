# Checklist triển khai GitHub Pages

- [ ] Giải nén `THANH_V3_GITHUB_READY.zip`.
- [ ] Upload toàn bộ file/thư mục bên trong ZIP vào root của repository.
- [ ] Kiểm tra `index.html`, `assets/`, `data/`, `fonts/`, `mon-hoc/` đều nằm cùng cấp ở root.
- [ ] Commit lên nhánh `main`.
- [ ] Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
- [ ] Mở URL GitHub Pages và kiểm tra: Trang chủ, Giới thiệu, Chương trình học, Môn 01 và các trang con, Liên hệ.
- [ ] Mở riêng `/THANH_V3_PREVIEW_EDITABLE.html` để kiểm tra bản xem có thể chỉnh sửa.
- [ ] Kiểm tra trên điện thoại và máy tính.

**Không upload `admin.html` lên repository public.** Bộ quản trị cục bộ nằm trong gói FULL KIT riêng. Bản Preview Editable không có quyền cập nhật repository; sau khi chỉnh sửa, cần xuất JSON và cập nhật `data/courses.json`.
