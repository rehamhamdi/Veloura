using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Discounts.GetDiscountUsages;

public class GetDiscountUsagesHandler
    : IRequestHandler<GetDiscountUsagesQuery, Response<List<DiscountUsageDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetDiscountUsagesHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<List<DiscountUsageDto>>> Handle(
        GetDiscountUsagesQuery request,
        CancellationToken cancellationToken)
    {
        var discountExists = await _context.Discounts
            .AsNoTracking()
            .AnyAsync(
                d => d.Id == request.DiscountId,
                cancellationToken);

        if (!discountExists)
        {
            return _responseHandler.NotFound<List<DiscountUsageDto>>(
                "Discount not found.");
        }

        var usages = await _context.DiscountUsages
            .AsNoTracking()
            .Where(du => du.DiscountId == request.DiscountId)
            .OrderByDescending(du => du.UsedAt)
            .Select(du => new DiscountUsageDto
            {
                UserId = du.UserId,
                UserName = du.User.Name,
                OrderId = du.OrderId,
                UsedAt = du.UsedAt
            })
            .ToListAsync(cancellationToken);

        return _responseHandler.Success(
            usages,
            "Discount usages retrieved successfully.");
    }
}