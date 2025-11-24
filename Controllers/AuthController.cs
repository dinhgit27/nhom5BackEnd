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

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
                return BadRequest("Username and password required");

            // Very simple hard-coded users for demo purposes
            var user = ValidateUser(req.Username, req.Password);
            if (user == null) return Unauthorized();

            var token = GenerateToken(user.Value.Username, user.Value.Role);
            return Ok(new { token });
        }

        private static (string Username, string Role)? ValidateUser(string username, string password)
        {
            if (username == "dinh" && password == "123") return ("dinh", "123");
            if (username == "tuan" && password == "321") return ("tuan", "321");
            return null;
        }

        private string GenerateToken(string username, string role)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "very_secret_key_please_change");
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public record LoginRequest(string Username, string Password);
    }
}
