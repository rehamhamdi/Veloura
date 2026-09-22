using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Discounts.GetAllDiscounts;

public class GetAllDiscountsHandler
    : IRequestHandler<GetAllDiscountsQuery, Response<List<DiscountDto>>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetAllDiscountsHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<List<DiscountDto>>> Handle(
        GetAllDiscountsQuery request,
        CancellationToken cancellationToken)
    {
        var discounts = await _context.Discounts
            .Select(d => new DiscountDto
            {
                Id = d.Id,
                Code = d.Code,
                Title = d.Title,
                Description = d.Description,
                Type = d.Type,
                Value = d.Value,
                MinimumOrderAmount = d.MinimumOrderAmount,
                AppliesTo = d.AppliesTo,
                StartsAt = d.StartsAt,
                ExpiresAt = d.ExpiresAt,
                MaxUses = d.MaxUses,
                UsedCount = d.UsedCount,
                IsActive = d.IsActive
            })
            .ToListAsync(cancellationToken);

        return _responseHandler.Success(
            discounts,
            "Discounts retrieved successfully.");
    }
}