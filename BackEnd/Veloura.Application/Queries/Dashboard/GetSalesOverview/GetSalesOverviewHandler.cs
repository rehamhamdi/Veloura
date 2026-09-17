using System.Globalization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Helpers;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Application.Queries.Dashboard.GetSalesOverview;

public class GetSalesOverviewHandler : IRequestHandler<GetSalesOverviewQuery, Response<SalesOverviewDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetSalesOverviewHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<SalesOverviewDto>> Handle(GetSalesOverviewQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var (currentStart, currentEnd, previousStart, previousEnd) = GetRanges(request.Period, now);

        
        var currentOrders = await _context.Orders
            .Where(o => o.Status != OrderStatus.Canceled && o.CreatedAt >= currentStart && o.CreatedAt < currentEnd)
            .Select(o => new { o.CreatedAt, o.Total })
            .ToListAsync(cancellationToken);

        var previousTotal = await _context.Orders
            .Where(o => o.Status != OrderStatus.Canceled && o.CreatedAt >= previousStart && o.CreatedAt < previousEnd)
            .SumAsync(o => (decimal?)o.Total, cancellationToken) ?? 0m;

        var points = BuildBuckets(request.Period, currentStart)
            .Select(bucket => new SalesPointDto
            {
                Label = bucket.Label,
                Value = currentOrders
                    .Where(o => o.CreatedAt >= bucket.Start && o.CreatedAt < bucket.End)
                    .Sum(o => o.Total)
            })
            .ToList();

        var totalRevenue = points.Sum(p => p.Value);

        var dto = new SalesOverviewDto
        {
            Period = request.Period,
            Points = points,
            TotalRevenue = totalRevenue,
            PercentageChange = PercentageChangeCalculator.Calculate(totalRevenue, previousTotal)
        };

        return _responseHandler.Success(dto, "Sales overview retrieved successfully");
    }

    private static (DateTime currentStart, DateTime currentEnd, DateTime previousStart, DateTime previousEnd) GetRanges(
        SalesOverviewPeriod period, DateTime now)
    {
        switch (period)
        {
            case SalesOverviewPeriod.Today:
                {
                    var start = now.Date;
                    var end = start.AddDays(1);
                    return (start, end, start.AddDays(-1), start);
                }
            case SalesOverviewPeriod.ThisMonth:
                {
                    var start = new DateTime(now.Year, now.Month, 1);
                    var end = start.AddMonths(1);
                    return (start, end, start.AddMonths(-1), start);
                }
            case SalesOverviewPeriod.ThisYear:
                {
                    var start = new DateTime(now.Year, 1, 1);
                    var end = start.AddYears(1);
                    return (start, end, start.AddYears(-1), start);
                }
            case SalesOverviewPeriod.ThisWeek:
            default:
                {
                    // Week starts Monday.
                    var diff = ((int)now.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
                    var start = now.Date.AddDays(-diff);
                    var end = start.AddDays(7);
                    return (start, end, start.AddDays(-7), start);
                }
        }
    }

    private static IEnumerable<(string Label, DateTime Start, DateTime End)> BuildBuckets(
        SalesOverviewPeriod period, DateTime periodStart)
    {
        switch (period)
        {
            case SalesOverviewPeriod.Today:
                for (var h = 0; h < 24; h++)
                {
                    var bucketStart = periodStart.AddHours(h);
                    yield return (bucketStart.ToString("h tt", CultureInfo.InvariantCulture), bucketStart, bucketStart.AddHours(1));
                }
                break;

            case SalesOverviewPeriod.ThisWeek:
                for (var d = 0; d < 7; d++)
                {
                    var bucketStart = periodStart.AddDays(d);
                    yield return (bucketStart.ToString("ddd", CultureInfo.InvariantCulture), bucketStart, bucketStart.AddDays(1));
                }
                break;

            case SalesOverviewPeriod.ThisMonth:
                var daysInMonth = DateTime.DaysInMonth(periodStart.Year, periodStart.Month);
                for (var d = 0; d < daysInMonth; d++)
                {
                    var bucketStart = periodStart.AddDays(d);
                    yield return ((d + 1).ToString(CultureInfo.InvariantCulture), bucketStart, bucketStart.AddDays(1));
                }
                break;

            case SalesOverviewPeriod.ThisYear:
                for (var m = 0; m < 12; m++)
                {
                    var bucketStart = periodStart.AddMonths(m);
                    yield return (bucketStart.ToString("MMM", CultureInfo.InvariantCulture), bucketStart, bucketStart.AddMonths(1));
                }
                break;
        }
    }
}
