using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Domain.Entities;
using Veloura.Infrastructure.Persistence;
using Veloura.Application.Interfaces;
namespace Veloura.Infrastructure.Repositories
{
    public class EfProductImageRepository : IProductImageRepository
    {

        private readonly AppDbContext _context;

        public EfProductImageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductImage>> GetByProductIdAsync(int productId)
        {
            return await _context.ProductImages
                .Where(i => i.ProductId == productId)
                .OrderBy(i => i.SortOrder)
                .ToListAsync();
        }

        public async Task<ProductImage?> GetByIdAsync(int id)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task AddAsync(ProductImage image)
        {
            await _context.ProductImages.AddAsync(image);
        }

        public void Update(ProductImage image)
        {
            _context.ProductImages.Update(image);
        }

        public async Task DeleteAsync(int id)
        {
            var image = await _context.ProductImages
                .FirstOrDefaultAsync(i => i.Id == id);

            if (image != null)
            {
                _context.ProductImages.Remove(image);
            }
        }
    }
}
