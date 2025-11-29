using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nhom5BackEnd.Data;

namespace nhom5BackEnd.Controllers
{
    [ApiController]
    [Route("api/public")]
    public class PublicApiController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PublicApiController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _db.Products.Select(p => new
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Price = p.Price,
                Description = p.Description,
                Stock = p.Stock
            }).ToListAsync();
            return Ok(products);
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _db.Customers.Select(c => new
            {
                CustomerId = c.Id,
                CustomerName = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Address = c.Address
            }).ToListAsync();
            return Ok(customers);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {

            var productsDict = await _db.Products.ToDictionaryAsync(p => p.Id, p => p.Name);

            var orders = await _db.Orders.Include(o => o.OrderDetails).ToListAsync();

            var result = orders.Select(o => new
            {
                OrderId = o.Id,
                OrderDate = o.CreatedAt,
                Status = o.Status,
                TotalAmount = o.Total,
                OrderDetails = o.OrderDetails.Select(od => new
                {
                    ProductId = od.ProductId,
                    ProductName = productsDict.ContainsKey(od.ProductId) ? productsDict[od.ProductId] : string.Empty,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice
                }).ToList()
            }).ToList();

            return Ok(result);
        }
    }
}
