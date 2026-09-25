using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<Payment?> GetByOrderIdAsync(int orderId, CancellationToken cancellationToken);
    Task AddAsync(Payment payment, CancellationToken cancellationToken);
    Task UpdateAsync(Payment payment, CancellationToken cancellationToken);
}