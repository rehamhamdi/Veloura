using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IContactMessageRepository
{
    Task AddAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken);

    Task<List<ContactMessage>> GetAllAsync(
        CancellationToken cancellationToken);

    Task<ContactMessage?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken);

    Task UpdateAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken);
}