using System.ComponentModel.DataAnnotations;
namespace nhom5BackEnd.DTOs
{
    public class CustomerCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class CustomerReadDto : CustomerCreateDto
    {
        public int Id { get; set; }
    }
}
