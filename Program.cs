using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using nhom5BackEnd.Data;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using nhom5BackEnd.Models;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);




JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "nhom5backend", Version = "v1" });


    option.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Vui lòng nhập Token vào đây (Không cần chữ Bearer nếu nhập ở đây)",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });


    option.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type=Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});



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
            RoleClaimType = "role",          
            NameClaimType = "unique_name"    
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

        Console.WriteLine($"Loi ket noi SQL: {ex.Message}");
    }
}




app.UseCors("AllowAll");


app.UseSwagger();
app.UseSwaggerUI();


var servicesPath = Path.Combine(app.Environment.ContentRootPath, "services");

if (Directory.Exists(servicesPath))
{

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(servicesPath),
        RequestPath = ""
    });
}
else
{

    Console.WriteLine($"CANH BAO: Khong tim thay thu muc tai: {servicesPath}");
}

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();


app.MapGet("/", async context =>
{
    if (Directory.Exists(servicesPath))
    {
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync(Path.Combine(servicesPath, "index.html"));
    }
    else
    {

        await context.Response.WriteAsync("Backend API is running OK. (Frontend 'services' folder is missing). Check Swagger at /swagger");
    }
});

app.Run();