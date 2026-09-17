using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}