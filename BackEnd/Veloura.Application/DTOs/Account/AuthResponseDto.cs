namespace Veloura.Application.DTOs.Account;

public class AuthResponseDto
{
    public string Token { get; set; } = default!;
    public UserSummaryDto User { get; set; } = default!;
}

public class UserSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Role { get; set; } = default!;
}