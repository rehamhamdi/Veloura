namespace Veloura.Application.DTOs.Account;

public class AddressDto
{
    public int Id { get; set; }
    public string? Label { get; set; }
    public string Street { get; set; } = default!;
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public string PostalCode { get; set; } = default!;
    public string Country { get; set; } = default!;
    public bool IsDefault { get; set; }
}
