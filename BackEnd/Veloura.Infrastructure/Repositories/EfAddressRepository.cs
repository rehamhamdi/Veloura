using Microsoft.EntityFrameworkCore;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Infrastructure.Persistence;

namespace Veloura.Infrastructure.Repositories;

public class EfAddressRepository : IAddressRepository
{
    private readonly AppDbContext _db;
    public EfAddressRepository(AppDbContext db) => _db = db;

    public Task<Address?> GetByIdAsync(int id, CancellationToken ct) =>
        _db.Addresses.FirstOrDefaultAsync(a => a.Id == id, ct);

    public Task<List<Address>> GetByUserIdAsync(int userId, CancellationToken ct) =>
        _db.Addresses.Where(a => a.UserId == userId).ToListAsync(ct);

    public async Task AddAsync(Address address, CancellationToken ct)
    {
        _db.Addresses.Add(address);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Address address, CancellationToken ct)
    {
        _db.Addresses.Update(address);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Address address, CancellationToken ct)
    {
        _db.Addresses.Remove(address);
        await _db.SaveChangesAsync(ct);
    }
}