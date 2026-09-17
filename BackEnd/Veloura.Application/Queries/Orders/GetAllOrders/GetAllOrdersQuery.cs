using MediatR;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Domain.Enums;

namespace Veloura.Application.Queries.Orders.GetAllOrders;

public record GetAllOrdersQuery(
    int Page = 1,
    int PageSize = 15,
    OrderStatus? Status = null,
    string? Search = null) : IRequest<Response<PaginatedList<AdminOrderListItemDto>>>;
