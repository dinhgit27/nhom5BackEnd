using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nhom5BackEnd.Models;
using nhom5BackEnd.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =================== TẤT CẢ SERVICES ĐẶT TRƯỚC builder.Build() ==================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình DbContext: Development dùng InMemory, Production dùng SQL Server
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("Nhom5Db"));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));
}

// JWT Configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DayLaMotCaiKeyRatLaBiMatVaRatLaDai2024!@#1234567890";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "nhom5BackEnd";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "nhom5BackEndUsers";

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

// CORS (cho frontend localhost)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
// ===============================================================================

var app = builder.Build();

// Seed data (chỉ chạy khi dùng InMemory)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { Name = "banh ngot", Price = 13000, Description = "ngot", Stock = 100 },
            new Product { Name = "mi", Price = 10000, Description = "ngon", Stock = 50 }
        );
    }
    if (!db.Customers.Any())
    {
        db.Customers.AddRange(
            new Customer { Name = "user", Email = "user@gmail.com", Phone = "0901234567" },
            new Customer { Name = "Admin", Email = "admin@gmail.com", Phone = "0909999999" }
        );
    }
    db.SaveChanges();
}

// Pipeline
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