using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nhom5BackEnd.Data;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using nhom5BackEnd.Models;
using Microsoft.Extensions.FileProviders; // Quan trọng để đọc file

var builder = WebApplication.CreateBuilder(args);

// ================== 1. CẤU HÌNH DỊCH VỤ (SERVICES) ==================

// Fix lỗi tự động đổi tên Claim của .NET
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1.1. Cấu hình Database (SQL Server)
// Đảm bảo file appsettings.json đã có chuỗi kết nối "DefaultConnection"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1.2. Cấu hình JWT Authentication
var jwtKey = "DayLaMotCaiKeyRatLaBiMatVaRatLaDai2024!@#1234567890";
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "nhom5BackEnd",
            ValidAudience = "nhom5FrontEnd",
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = "role",          // Khớp với AuthController
            NameClaimType = "unique_name"    // Khớp với AuthController
        };
    });

builder.Services.AddAuthorization();

// 1.3. Cấu hình CORS (Cho phép tất cả)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ================== 2. KHỞI TẠO DATABASE ==================
// Tự động tạo bảng nếu chưa có (khi chạy lần đầu)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        // Ghi log lỗi nếu không kết nối được SQL (để debug file exe)
        Console.WriteLine($"Loi ket noi SQL: {ex.Message}");
    }
}

// ================== 3. PIPELINE (THỨ TỰ CỰC KỲ QUAN TRỌNG) ==================

// BƯỚC 1: CORS phải chạy đầu tiên
app.UseCors("AllowAll");

// BƯỚC 2: Swagger (Bật cho cả Production để dễ test trên IIS)
app.UseSwagger();
app.UseSwaggerUI();

// BƯỚC 3: Phục vụ File Tĩnh (Frontend) - Code An Toàn
var servicesPath = Path.Combine(app.Environment.ContentRootPath, "services");

if (Directory.Exists(servicesPath))
{
    // Nếu tìm thấy thư mục services thì mới phục vụ file
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(servicesPath),
        RequestPath = ""
    });
}
else
{
    // Nếu không thấy thì chỉ in cảnh báo ra console, KHÔNG làm sập web
    Console.WriteLine($"CANH BAO: Khong tim thay thu muc tai: {servicesPath}");
}

app.UseHttpsRedirection();

// BƯỚC 4: Xác thực & Phân quyền
app.UseAuthentication();
app.UseAuthorization();

// BƯỚC 5: Map Controllers (API)
app.MapControllers();

// BƯỚC 6: Map Trang Chủ (Fallback về index.html)
app.MapGet("/", async context =>
{
    if (Directory.Exists(servicesPath))
    {
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(Path.Combine(servicesPath, "index.html"));
    }
    else
    {
        // Thông báo nếu quên copy thư mục services
        await context.Response.WriteAsync("Backend API is running OK. (Frontend 'services' folder is missing). Check Swagger at /swagger");
    }
});

app.Run();