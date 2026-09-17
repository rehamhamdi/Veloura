using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IAddressRepository
{
    Task<Address?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<List<Address>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
    Task AddAsync(Address address, CancellationToken cancellationToken);
    Task UpdateAsync(Address address, CancellationToken cancellationToken);
    Task DeleteAsync(Address address, CancellationToken cancellationToken);
    Task UnsetDefaultForUserAsync(int userId, CancellationToken cancellationToken);
}   