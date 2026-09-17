using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Orders.GetAllOrders;

public class GetAllOrdersHandler : IRequestHandler<GetAllOrdersQuery, Response<PaginatedList<AdminOrderListItemDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetAllOrdersHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<PaginatedList<AdminOrderListItemDto>>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Orders.Include(o => o.User).AsQueryable();

        if (request.Status.HasValue)
            query = query.Where(o => o.Status == request.Status.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            var isNumeric = int.TryParse(search, out var orderId);
            query = query.Where(o =>
                (isNumeric && o.Id == orderId) ||
                o.User.Name.Contains(search));
        }

        var projected = query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new AdminOrderListItemDto
            {
                Id = o.Id,
                BuyerName = o.User.Name,
                Status = o.Status,
                Total = o.Total,
                CreatedAt = o.CreatedAt
            });

        var result = await PaginatedList<AdminOrderListItemDto>.CreateAsync(projected, request.Page, request.PageSize);

        return _responseHandler.Success(result, "Orders retrieved successfully");
    }
}
