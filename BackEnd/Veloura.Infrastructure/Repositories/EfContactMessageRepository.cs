using Microsoft.EntityFrameworkCore;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Infrastructure.Persistence;

namespace Veloura.Infrastructure.Repositories;

public class EfContactMessageRepository : IContactMessageRepository
{
    private readonly AppDbContext _db;

    public EfContactMessageRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(
        ContactMessage contactMessage,
        CancellationToken cancellationToken)
    {
        _db.ContactMessages.Add(contactMessage);

        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ContactMessage>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        return await _db.ContactMessages
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}