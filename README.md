# nhom5BackEnd
1.	Mở appsettings.json trong thư mục Backend.
2.	Sửa ConnectionStrings trỏ về SQL Server của máy bạn.
3.	Mở Terminal tại thư mục Backend, chạy lệnh sau để tạo Database:
Bash
dotnet ef database update
4.	Chạy dự án:
Bash
dotnet run
Cổng (Port) mà server đang chạy https://localhost:7030.
Bước 2: Cấu hình Frontend
1.	Mở file services/app.js.
2.	Tìm dòng apiBase và sửa lại đúng cổng của Backend vừa chạy ở Bước 1.
JavaScript
apiBase: 'http://api.nhom5.com/api'
Bước 3: Trải nghiệm
1.	Chạy dotnet run trên teminal và lênh trình duyệt bất kỳ nhập nhom5.com.
2.	Đăng nhập bằng tài khoản Demo (được seed sẵn) hoặc có thể tiến hành đăng ký:
o	Admin: admin@admin.com / admin
o	User: user@user.com / user

📂 Cấu Trúc Dự Án (Backend)
nhom5BackEnd/
├── Controllers/       # Xử lý API (Auth, Orders, Products...)
├── Data/              # DbContext (Kết nối CSDL)
├── DTOs/              # Data Transfer Objects (Input/Output Models)
├── Models/            # Entity Models (Cấu trúc bảng Database)
├── Migrations/        # Lịch sử thay đổi Database
├── Program.cs
└── Services/          # Cấu hình các Design, các dữ liệu 
└── appsettings.json   # Cấu hình Connection String, JWT Key
________________________________________
© 2025 Nhóm 5 Lập trình Backend