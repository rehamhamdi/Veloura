using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();

        Task<Product?> GetByIdAsync(int id);

        Task AddAsync(Product product);

        void Update(Product product);

        Task DeleteAsync(int id);
    }
}
