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
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Products.ToListAsync();
            return Ok(items.Select(p => new ProductReadDto { Id = p.Id, Name = p.Name, Price = p.Price, Description = p.Description, Stock = p.Stock }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            return Ok(new ProductReadDto { Id = p.Id, Name = p.Name, Price = p.Price, Description = p.Description, Stock = p.Stock });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var p = new Product { Name = dto.Name, Price = dto.Price, Description = dto.Description, Stock = dto.Stock };
            _db.Products.Add(p);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            p.Name = dto.Name;
            p.Price = dto.Price;
            p.Description = dto.Description;
            p.Stock = dto.Stock;
            await _db.SaveChangesAsync();
            return Ok(p);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound();
            _db.Products.Remove(p);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
