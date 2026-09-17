using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Helpers;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Application.Queries.Dashboard.GetSummary;

public class GetSummaryHandler : IRequestHandler<GetSummaryQuery, Response<DashboardSummaryDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetSummaryHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<DashboardSummaryDto>> Handle(GetSummaryQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var thisMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var lastMonthStart = thisMonthStart.AddMonths(-1);

        // ---- Total sales (lifetime, excluding cancelled orders) ----
        var nonCancelledOrders = _context.Orders.Where(o => o.Status != OrderStatus.Canceled);

        var totalSalesValue = await nonCancelledOrders.SumAsync(o => (decimal?)o.Total, cancellationToken) ?? 0m;
        var salesThisMonth = await nonCancelledOrders
            .Where(o => o.CreatedAt >= thisMonthStart)
            .SumAsync(o => (decimal?)o.Total, cancellationToken) ?? 0m;
        var salesLastMonth = await nonCancelledOrders
            .Where(o => o.CreatedAt >= lastMonthStart && o.CreatedAt < thisMonthStart)
            .SumAsync(o => (decimal?)o.Total, cancellationToken) ?? 0m;

        var totalOrdersValue = await _context.Orders.CountAsync(cancellationToken);
        var ordersThisMonth = await _context.Orders.CountAsync(o => o.CreatedAt >= thisMonthStart, cancellationToken);
        var ordersLastMonth = await _context.Orders
            .CountAsync(o => o.CreatedAt >= lastMonthStart && o.CreatedAt < thisMonthStart, cancellationToken);

        var totalProductsValue = await _context.Products.CountAsync(cancellationToken);
        var productsThisMonth = await _context.Products.CountAsync(p => p.CreatedAt >= thisMonthStart, cancellationToken);
        var productsLastMonth = await _context.Products
            .CountAsync(p => p.CreatedAt >= lastMonthStart && p.CreatedAt < thisMonthStart, cancellationToken);

        var buyers = _context.Users.Where(u => u.Role == UserRole.Buyer);
        var totalCustomersValue = await buyers.CountAsync(cancellationToken);
        var customersThisMonth = await buyers.CountAsync(u => u.CreatedAt >= thisMonthStart, cancellationToken);
        var customersLastMonth = await buyers
            .CountAsync(u => u.CreatedAt >= lastMonthStart && u.CreatedAt < thisMonthStart, cancellationToken);

        var dto = new DashboardSummaryDto
        {
            TotalSales = new StatCardDto
            {
                Value = totalSalesValue,
                PercentageChange = PercentageChangeCalculator.Calculate(salesThisMonth, salesLastMonth)
            },
            TotalOrders = new StatCardDto
            {
                Value = totalOrdersValue,
                PercentageChange = PercentageChangeCalculator.Calculate(ordersThisMonth, ordersLastMonth)
            },
            TotalProducts = new StatCardDto
            {
                Value = totalProductsValue,
                PercentageChange = PercentageChangeCalculator.Calculate(productsThisMonth, productsLastMonth)
            },
            TotalCustomers = new StatCardDto
            {
                Value = totalCustomersValue,
                PercentageChange = PercentageChangeCalculator.Calculate(customersThisMonth, customersLastMonth)
            }
        };

        return _responseHandler.Success(dto, "Dashboard summary retrieved successfully");
    }
}
