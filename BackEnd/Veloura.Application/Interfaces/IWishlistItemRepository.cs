using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces
{
    public interface IWishlistItemRepository
    {
        Task<List<WishlistItem>> GetByUserIdAsync(int userId);

        Task<WishlistItem?> GetByIdAsync(int id);

        Task<WishlistItem?> GetByUserAndProductAsync(
            int userId,
            int productId);

        Task AddAsync(WishlistItem item);

        void Update(WishlistItem item);

        Task DeleteAsync(int id);
    }
}
