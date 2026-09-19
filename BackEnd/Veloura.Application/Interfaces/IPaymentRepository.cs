using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(int id);

        Task<Payment?> GetByOrderIdAsync(int orderId);

        Task AddAsync(Payment payment);

        void Update(Payment payment);
    }
}
