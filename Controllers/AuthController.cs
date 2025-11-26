using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace nhom5BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        public AuthController(IConfiguration config) { _config = config; }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
                return BadRequest("Cần nhập username và password");

            var user = ValidateUser(req.Username, req.Password);
            if (user == null) return Unauthorized("Sai tài khoản hoặc mật khẩu");

            // Truyền đủ 3 tham số: Username, Role, CustomerId
            var token = GenerateToken(user.Value.Username, user.Value.Role, user.Value.CustomerId);
            return Ok(new { token });
        }

        private static (string Username, string Role, int CustomerId)? ValidateUser(string username, string password)
        {
            // QUAN TRỌNG: User ID = 1, Admin ID = 2
            if (username == "admin@admin.com" && password == "admin") return ("Admin User", "Admin", 2);
            if (username == "user@user.com" && password == "user") return ("Normal User", "User", 1);
            return null;
        }

        private string GenerateToken(string username, string role, int customerId)
        {
            // KEY CỐ ĐỊNH - PHẢI GIỐNG Y CHANG BÊN PROGRAM.CS
            var keyString = "DayLaMotCaiKeyRatLaBiMatVaRatLaDai2024!@#1234567890";
            var key = Encoding.UTF8.GetBytes(keyString);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                // Sửa lỗi: Chỉ giữ lại 1 dòng này và đảm bảo cú pháp đúng
                new Claim("CustomerId", customerId.ToString()) 
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "nhom5BackEnd",      // Cố định cứng
                audience: "nhom5FrontEnd",   // Cố định cứng
                claims: claims,
                expires: DateTime.UtcNow.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public record LoginRequest(string Username, string Password);
    }
}