using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IContactMessageRepository
{
    Task AddAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken);

    Task<List<ContactMessage>> GetAllAsync(
        CancellationToken cancellationToken);
}