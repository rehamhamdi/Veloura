using MediatR;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Orders.GetMyOrders;

public class GetMyOrdersHandler : IRequestHandler<GetMyOrdersQuery, Response<PaginatedList<OrderSummaryDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetMyOrdersHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<PaginatedList<OrderSummaryDto>>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Where(o => o.UserId == request.UserId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderSummaryDto
            {
                Id = o.Id,
                Status = o.Status,
                Total = o.Total,
                ItemsCount = o.OrderItems.Count,
                CreatedAt = o.CreatedAt
            });

        var result = await PaginatedList<OrderSummaryDto>.CreateAsync(query, request.Page, request.PageSize);

        return _responseHandler.Success(result, "Orders retrieved successfully");
    }
}
