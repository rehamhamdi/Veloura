using MediatR;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;

namespace Veloura.Application.Queries.Orders.GetMyOrders;

public record GetMyOrdersQuery(int UserId, int Page = 1, int PageSize = 10) : IRequest<Response<PaginatedList<OrderSummaryDto>>>;
