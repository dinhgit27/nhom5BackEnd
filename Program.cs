using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nhom5BackEnd.Data;
using System.Text;
using System.IdentityModel.Tokens.Jwt; // <-- Cần thêm dòng này
using nhom5BackEnd.Models;

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
            
            // Đảm bảo 2 dòng này KHỚP với AuthController vừa sửa
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
    
    if (!db.Customers.Any())
    {
        db.Customers.AddRange(
            new Customer { Id = 1, Name = "Normal User", Email = "user@user.com" },
            new Customer { Id = 2, Name = "Admin User", Email = "admin@admin.com" }
        );
    }
    
    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { Id = 1, Name = "Bánh ngọt", Price = 15000, Description = "Ngon", Stock = 100 },
            new Product { Id = 2, Name = "Mì tôm", Price = 5000, Description = "Cay", Stock = 50 }
        );
    }
    
    if (!db.Orders.Any())
    {
        db.Orders.AddRange(
            new Order
            {
                Id = 1,
                CustomerId = 1,  // User
                CreatedAt = DateTime.UtcNow,
                Status = "New",
                Total = 20000m,
                OrderDetails = new List<OrderDetail>
                {
                    new OrderDetail { Id = 1, OrderId = 1, ProductId = 1, Quantity = 1, UnitPrice = 15000m },
                    new OrderDetail { Id = 2, OrderId = 1, ProductId = 2, Quantity = 1, UnitPrice = 5000m }
                }
            },
            new Order
            {
                Id = 2,
                CustomerId = 1,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                Status = "Completed",
                Total = 5000m,
                OrderDetails = new List<OrderDetail>
                {
                    new OrderDetail { Id = 3, OrderId = 2, ProductId = 2, Quantity = 1, UnitPrice = 5000m }
                }
            }
        );
    }
    
    db.SaveChanges();
}

app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();