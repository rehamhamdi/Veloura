using MediatR;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;

namespace Veloura.Application.Queries.Dashboard.GetRecentOrders;

public record GetRecentOrdersQuery(int Page = 1, int PageSize = 4) : IRequest<Response<PaginatedList<RecentOrderDto>>>;
