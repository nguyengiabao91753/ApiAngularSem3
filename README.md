Dưới đây là nội dung hướng dẫn cài đặt **Frontend (Angular)** tương tự như phần bạn đã làm với Backend, được trình bày theo định dạng Markdown phù hợp để đưa vào file `README.md`, hoặc chép vào Word:

---

## 🖥️ FRONTEND (Angular)

### 📁 1. Clone Dự Án

Sử dụng Git để tải mã nguồn giao diện về máy:

```bash
git clone https://github.com/nguyengiabao91753/ApiAngularSem3.git
cd ApiAngularSem3
```

---

### ⚙️ 2. Cài Đặt Thư Viện

Sau khi mở thư mục dự án trong VS Code hoặc IDE bất kỳ, mở Terminal và chạy các lệnh sau:

```bash
npm install zone.js@~0.14.10 --save
npm install
npm install -g @angular/cli
```

> 💡 `zone.js` là thư viện bắt buộc cho Angular. Lệnh này đảm bảo đúng version yêu cầu.

---

### 🚀 3. Start Dự Án

Khởi động dự án Angular bằng lệnh:

```bash
ng s -o
```

> ✅ Cờ `-o` giúp tự động mở trình duyệt khi chạy thành công.

---
Dưới đây là phần hướng dẫn thêm **tài khoản test PayPal** để bạn có thể chèn vào `README.md` hoặc tài liệu cài đặt của bạn:

---

### 💳 4. Tài Khoản Test PayPal

Sử dụng tài khoản sandbox của PayPal để kiểm tra chức năng thanh toán trong quá trình phát triển:

- **Email:** `sb-p07it33120207@personal.example.com`  
- **Mật khẩu:** `?G3j)'s6`

> 🔐 Đây là tài khoản **sandbox** (không dùng được ngoài môi trường test). Bạn có thể truy cập trang quản lý sandbox tại [https://developer.paypal.com/dashboard/accounts](https://developer.paypal.com/dashboard/accounts).

---

### 📌 Lưu Ý

- Đảm bảo bạn đã cài đặt **Node.js** và **npm**. Nếu chưa có, tải tại: https://nodejs.org/
- Nếu gặp lỗi liên quan đến quyền, hãy chạy terminal với quyền **Admin** (trên Windows).



