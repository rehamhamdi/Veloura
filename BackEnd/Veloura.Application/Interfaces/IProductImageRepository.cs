using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces
{
   public interface IProductImageRepository
    {
        Task<List<ProductImage>> GetByProductIdAsync(int productId);

        Task<ProductImage?> GetByIdAsync(int id);

        Task AddAsync(ProductImage image);

        void Update(ProductImage image);

        Task DeleteAsync(int id);
    }
}
