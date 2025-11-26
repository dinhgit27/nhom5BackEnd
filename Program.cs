using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nhom5BackEnd.Data;
using System.Text;
using System.IdentityModel.Tokens.Jwt; // <-- Cần thêm dòng này

var builder = WebApplication.CreateBuilder(args);

// --- 1. CHẶN .NET TỰ ĐỘNG ĐỔI TÊN CLAIM (Magic Fix) ---
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình DB
builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("Nhom5Db"));

// Cấu hình JWT
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
            
            // Quan trọng: Giữ nguyên tên Claim
            RoleClaimType = "role",
            NameClaimType = "unique_name" 
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    
    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new nhom5BackEnd.Models.Product { Name = "Bánh ngọt", Price = 15000, Description = "Ngon", Stock = 100 },
            new nhom5BackEnd.Models.Product { Name = "Mì tôm", Price = 5000, Description = "Cay", Stock = 50 }
        );
    }
    // Tạo User mẫu để test đặt hàng
    if (!db.Customers.Any())
    {
        db.Customers.AddRange(
            new nhom5BackEnd.Models.Customer { Id = 1, Name = "User Demo", Email = "user@user.com", Address = "VN", Phone = "123" },
            new nhom5BackEnd.Models.Customer { Id = 2, Name = "Admin Demo", Email = "admin@admin.com", Address = "VN", Phone = "456" }
        );
    }
    db.SaveChanges();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();