using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Entities;
using Veloura.Infrastructure.Persistence;
using Veloura.Application.Interfaces;
namespace Veloura.Infrastructure.Repositories
{
    public class EfWishlistItemRepository : IWishlistItemRepository
    {

        private readonly AppDbContext _context;

        public EfWishlistItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishlistItem>> GetByUserIdAsync(int userId)
        {
            return await _context.WishlistItems
                .Include(w => w.Product)
                .ThenInclude(p => p.Images)
                .Where(w => w.UserId == userId)
                .ToListAsync();
        }

        public async Task<WishlistItem?> GetByIdAsync(int id)
        {
            return await _context.WishlistItems
                .Include(w => w.Product)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<WishlistItem?> GetByUserAndProductAsync(
            int userId,
            int productId)
        {
            return await _context.WishlistItems
                .FirstOrDefaultAsync(w =>
                    w.UserId == userId &&
                    w.ProductId == productId);
        }

        public async Task AddAsync(WishlistItem item)
        {
            await _context.WishlistItems.AddAsync(item);
        }

        public void Update(WishlistItem item)
        {
            _context.WishlistItems.Update(item);
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(w => w.Id == id);

            if (item != null)
            {
                _context.WishlistItems.Remove(item);
            }
        }
    }
}
