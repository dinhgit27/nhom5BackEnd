using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add InMemory EF Core
builder.Services.AddDbContext<nhom5BackEnd.Data.AppDbContext>(opt =>
    opt.UseInMemoryDatabase("AppDb"));

// JWT configuration
builder.Configuration["Jwt:Key"] ??= "very_secret_key_please_change";
builder.Configuration["Jwt:Issuer"] ??= "nhom5BackEnd";
builder.Configuration["Jwt:Audience"] ??= "nhom5BackEndUsers";

var key = System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Seed demo data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<nhom5BackEnd.Data.AppDbContext>();
    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new nhom5BackEnd.Models.Product { Name = "Widget A", Price = 10.5m, Description = "Sample A", Stock = 100 },
            new nhom5BackEnd.Models.Product { Name = "Widget B", Price = 20m, Description = "Sample B", Stock = 50 }
        );
    }
    if (!db.Customers.Any())
    {
        db.Customers.AddRange(
            new nhom5BackEnd.Models.Customer { Name = "User Customer", Email = "user@example.com" },
            new nhom5BackEnd.Models.Customer { Name = "Admin Customer", Email = "admin@example.com" }
        );
    }
    db.SaveChanges();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
