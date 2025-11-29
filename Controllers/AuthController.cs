
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using Microsoft.Extensions.Configuration;
using nhom5BackEnd.Data;
using nhom5BackEnd.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Data;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;


namespace nhom5BackEnd.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IConfiguration _config;
		private readonly AppDbContext _db;
		public AuthController(IConfiguration config, AppDbContext db) { _config = config; _db = db; }

		[HttpPost("login")]
		public IActionResult Login([FromBody] LoginRequest req)
		{
			if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
				return BadRequest("Cần nhập username và password");

			var user = ValidateUser(req.Username, req.Password);
			if (user == null) return Unauthorized("Sai tài khoản hoặc mật khẩu");

			var token = GenerateToken(user.Value.Username, user.Value.Role, user.Value.CustomerId);
			return Ok(new { token });
		}

		private (string Username, string Role, int CustomerId)? ValidateUser(string username, string password)
		{
			if (username == "admin@admin.com" && password == "admin") return ("Admin User", "Admin", 2);
			if (username == "user@user.com" && password == "user") return ("Normal User", "User", 1);

			var customer = _db.Customers.FirstOrDefault(c => c.Email == username);
			if (customer == null) return null;
			if (string.IsNullOrEmpty(customer.PasswordHash)) return null;

			var hasher = new PasswordHasher<Customer>();
			var verify = hasher.VerifyHashedPassword(customer, customer.PasswordHash, password);
			if (verify == PasswordVerificationResult.Success || verify == PasswordVerificationResult.SuccessRehashNeeded)
			{
				var displayName = string.IsNullOrEmpty(customer.Name) ? customer.Email : customer.Name;
				return (displayName, "User", customer.Id);
			}

			return null;
		}

		[HttpPost("register")]
		public IActionResult Register([FromBody] RegisterRequest req)
		{
			try
			{
				if (req == null) return BadRequest("Thiếu dữ liệu đăng ký.");
				if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
					return BadRequest("Vui lòng nhập tên, email và mật khẩu.");

				var exists = _db.Customers.FirstOrDefault(c => c.Email == req.Email);
				if (exists != null) return Conflict("Email đã được đăng ký.");

				var customer = new Customer
				{
					Name = req.Username,
					Email = req.Email,
					Phone = req.Phone,
					Address = req.Address
				};

				var hasher = new PasswordHasher<Customer>();
				customer.PasswordHash = hasher.HashPassword(customer, req.Password);

				_db.Customers.Add(customer);
				_db.SaveChanges();

				return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Lỗi đăng ký: {ex.Message}");
			}
		}

		[HttpGet("customers/{id}")]
		public IActionResult GetCustomerById(int id)
		{
			var c = _db.Customers.Find(id);
			if (c == null) return NotFound();
			return Ok(c);
		}

		private string GenerateToken(string username, string role, int customerId)
		{
			var keyString = "DayLaMotCaiKeyRatLaBiMatVaRatLaDai2024!@#1234567890";
			var key = Encoding.UTF8.GetBytes(keyString);

			var claims = new List<Claim>
			{
				new Claim("unique_name", username),
				new Claim("role", role),
				new Claim("CustomerId", customerId.ToString())
			};

			var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
			var token = new JwtSecurityToken(
				issuer: "nhom5BackEnd",
				audience: "nhom5FrontEnd",
				claims: claims,
				expires: DateTime.UtcNow.AddHours(6),
				signingCredentials: creds
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		public record LoginRequest(string Username, string Password);
		public record RegisterRequest(string Username, string Phone, string Email, string Password, string? Address);
	}
}