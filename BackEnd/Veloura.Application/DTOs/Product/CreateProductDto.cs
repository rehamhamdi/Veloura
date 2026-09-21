using Microsoft.AspNetCore.Http;

namespace Veloura.Application.DTOs.Product;

public class CreateProductDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public string? Category { get; set; }

    public List<IFormFile> Images { get; set; } = new();
}