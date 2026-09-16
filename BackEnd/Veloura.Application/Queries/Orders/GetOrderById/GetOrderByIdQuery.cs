using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;

namespace Veloura.Application.Queries.Orders.GetOrderById
{
    /// <param name="UserId">Caller's user id.</param>
    /// <param name="OrderId">Order to fetch.</param>
    /// <param name="IsAdmin">When true, ownership is not enforced (admin can view any order).</param>
    public record GetOrderByIdQuery(int UserId, int OrderId, bool IsAdmin = false) : IRequest<Response<OrderDto>>;
}
