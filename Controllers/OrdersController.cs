// --- OrdersController.cs ---
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nhom5BackEnd.Data;
using nhom5BackEnd.DTOs;
using nhom5BackEnd.Models;
using System.Security.Claims;

namespace nhom5BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        // Helper để lấy CustomerId từ Token
        private int GetCurrentCustomerId()
        {
            var claim = User.FindFirst("CustomerId");
            if (claim != null && int.TryParse(claim.Value, out int id))
            {
                return id;
            }
            return 0;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _db.Orders.Include(o => o.OrderDetails).ToListAsync();
            return Ok(orders);
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            // SỬA: Lấy ID trực tiếp từ Token
            int custId = GetCurrentCustomerId();
            if (custId == 0) return Unauthorized();

            var orders = await _db.Orders.Where(o => o.CustomerId == custId).Include(o => o.OrderDetails).ToListAsync();
            return Ok(orders);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // SỬA: Lấy ID trực tiếp từ Token
            int custId = GetCurrentCustomerId();
            if (custId == 0) return Unauthorized();

            if (dto.Items == null || !dto.Items.Any()) return BadRequest("Order must contain items");

            // Logic tính toán giữ nguyên
            decimal total = 0m;
            var order = new Order { CustomerId = custId, CreatedAt = DateTime.UtcNow, Status = "New" };
            foreach (var item in dto.Items)
            {
                if (item.Quantity <= 0) return BadRequest("Quantity must be > 0");
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest($"Product {item.ProductId} not found");
                if (product.Stock < item.Quantity) return BadRequest($"Insufficient stock for product {product.Id}");
                
                var od = new OrderDetail { ProductId = product.Id, Quantity = item.Quantity, UnitPrice = item.UnitPrice };
                order.OrderDetails.Add(od);
                total += item.UnitPrice * item.Quantity;
                
                // Trừ tồn kho
                product.Stock -= item.Quantity;
            }

            order.Total = total;
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = order.Id }, order);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var o = await _db.Orders.FindAsync(id);
            if (o == null) return NotFound();
            o.Status = dto.Status;
            await _db.SaveChangesAsync();
            return Ok(o);
        }
    }

    public class UpdateStatusDto { public string Status { get; set; } = string.Empty; }
}