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
builder.Services.AddDbContext<AppDbContext>(options =>
 options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
}

app.UseSwagger();
app.UseSwaggerUI();

// Serve static files from 'services' folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "services")),
    RequestPath = ""
});

// Default route to index.html
app.MapGet("/", context =>
{
    context.Response.ContentType = "text/html";
    return context.Response.SendFileAsync(Path.Combine(app.Environment.ContentRootPath, "services", "index.html"));
});

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();