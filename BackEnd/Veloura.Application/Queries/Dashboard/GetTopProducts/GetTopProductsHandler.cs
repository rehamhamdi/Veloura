using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Application.Queries.Dashboard.GetTopProducts;

public class GetTopProductsHandler : IRequestHandler<GetTopProductsQuery, Response<List<TopProductDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetTopProductsHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<List<TopProductDto>>> Handle(GetTopProductsQuery request, CancellationToken cancellationToken)
    {
        var limit = request.Limit is < 1 or > 10 ? 3 : request.Limit;

        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);
        var monthEnd = monthStart.AddMonths(1);

        var ranked = await _context.OrderItems
            .Where(oi =>
                oi.Order.Status != OrderStatus.Canceled &&
                oi.Order.CreatedAt >= monthStart &&
                oi.Order.CreatedAt < monthEnd)
            .GroupBy(oi => new { oi.ProductId, oi.Product.Title, oi.Product.Category })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.Title,
                g.Key.Category,
                UnitsSold = g.Sum(x => x.Quantity),
                Revenue = g.Sum(x => x.Quantity * x.Price)
            })
            .OrderByDescending(x => x.UnitsSold)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var productIds = ranked.Select(r => r.ProductId).ToList();
        var images = await _context.ProductImages
            .Where(i => productIds.Contains(i.ProductId))
            .OrderBy(i => i.SortOrder)
            .ToListAsync(cancellationToken);

        var result = ranked.Select((r, index) => new TopProductDto
        {
            Rank = index + 1,
            ProductId = r.ProductId,
            Title = r.Title,
            Category = r.Category,
            ImageUrl = images.FirstOrDefault(i => i.ProductId == r.ProductId)?.Url,
            UnitsSold = r.UnitsSold,
            Revenue = r.Revenue
        }).ToList();

        return _responseHandler.Success(result, "Top products retrieved successfully");
    }
}
