using Microsoft.EntityFrameworkCore;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Infrastructure.Persistence;

namespace Veloura.Infrastructure.Repositories;

public class EfPaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _db;
    public EfPaymentRepository(AppDbContext db) => _db = db;

    public Task<Payment?> GetByIdAsync(int id, CancellationToken ct) =>
        _db.Payments.FirstOrDefaultAsync(p => p.Id == id, ct);

    public Task<Payment?> GetByOrderIdAsync(int orderId, CancellationToken ct) =>
        _db.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId, ct);

    public async Task AddAsync(Payment payment, CancellationToken ct)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Payment payment, CancellationToken ct)
    {
        _db.Payments.Update(payment);
        await _db.SaveChangesAsync(ct);
    }
}