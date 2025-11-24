using System.ComponentModel.DataAnnotations;

namespace nhom5BackEnd.Models
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string Status { get; set; } = "New";

        [Range(0, double.MaxValue)]
        public decimal Total { get; set; }

        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}
