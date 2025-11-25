using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nhom5BackEnd.Data;
using nhom5BackEnd.DTOs;
using nhom5BackEnd.Models;

namespace nhom5BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CustomersController(AppDbContext db)
        {
            _db = db;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Customers.ToListAsync());

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var c = await _db.Customers.FindAsync(id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var c = new Customer { Name = dto.Name, Email = dto.Email, Phone = dto.Phone, Address = dto.Address };
            _db.Customers.Add(c);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var c = await _db.Customers.FindAsync(id);
            if (c == null) return NotFound();
            c.Name = dto.Name; c.Email = dto.Email; c.Phone = dto.Phone; c.Address = dto.Address;
            await _db.SaveChangesAsync();
            return Ok(c);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _db.Customers.FindAsync(id);
            if (c == null) return NotFound();
            _db.Customers.Remove(c);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
