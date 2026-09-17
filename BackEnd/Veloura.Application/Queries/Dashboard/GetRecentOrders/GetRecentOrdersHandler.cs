using MediatR;
using Veloura.Application.Common.Models;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Dashboard.GetRecentOrders;

public class GetRecentOrdersHandler : IRequestHandler<GetRecentOrdersQuery, Response<PaginatedList<RecentOrderDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetRecentOrdersHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<PaginatedList<RecentOrderDto>>> Handle(GetRecentOrdersQuery request, CancellationToken cancellationToken)
    {
        
        var query = _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new RecentOrderDto
            {
                OrderId = o.Id,
                CustomerName = o.User.Name,
                CustomerInitials = string.Empty, 
                Date = o.CreatedAt,
                Total = o.Total,
                Status = o.Status
            });

        var page = await PaginatedList<RecentOrderDto>.CreateAsync(query, request.Page, request.PageSize);

        foreach (var item in page.Items)
            item.CustomerInitials = BuildInitials(item.CustomerName);

        return _responseHandler.Success(page, "Recent orders retrieved successfully");
    }

    private static string BuildInitials(string fullName)
    {
        var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return parts.Length switch
        {
            0 => "?",
            1 => parts[0][..1].ToUpperInvariant(),
            _ => (parts[0][..1] + parts[^1][..1]).ToUpperInvariant()
        };
    }
}
