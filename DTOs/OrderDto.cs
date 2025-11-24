using System.ComponentModel.DataAnnotations;
namespace nhom5BackEnd.DTOs
{
    public class OrderDetailCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }
    }

    public class OrderCreateDto
    {
        public List<OrderDetailCreateDto> Items { get; set; } = new();
    }

    public class OrderReadDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}
