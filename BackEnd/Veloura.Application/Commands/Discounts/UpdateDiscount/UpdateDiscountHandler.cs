using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Discounts.UpdateDiscount;

public class UpdateDiscountHandler
    : IRequestHandler<UpdateDiscountCommand, Response<DiscountDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public UpdateDiscountHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<DiscountDto>> Handle(
        UpdateDiscountCommand request,
        CancellationToken cancellationToken)
    {
        var discount = await _context.Discounts
            .FirstOrDefaultAsync(
                d => d.Id == request.Id,
                cancellationToken);

        if (discount is null)
        {
            return _responseHandler.NotFound<DiscountDto>(
                "Discount not found.");
        }

        var normalizedCode = request.Discount.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Discounts
            .AnyAsync(
                d => d.Id != request.Id &&
                     d.Code == normalizedCode,
                cancellationToken);

        if (codeExists)
        {
            return _responseHandler.BadRequest<DiscountDto>(
                "Discount code already exists.");
        }

        discount.Code = normalizedCode;
        discount.Title = request.Discount.Title.Trim();
        discount.Description = request.Discount.Description?.Trim();
        discount.Type = request.Discount.Type;
        discount.Value = request.Discount.Value;
        discount.MinimumOrderAmount = request.Discount.MinimumOrderAmount;
        discount.AppliesTo = request.Discount.AppliesTo.Trim();
        discount.StartsAt = request.Discount.StartsAt;
        discount.ExpiresAt = request.Discount.ExpiresAt;
        discount.MaxUses = request.Discount.MaxUses;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new DiscountDto
        {
            Id = discount.Id,
            Code = discount.Code,
            Title = discount.Title,
            Description = discount.Description,
            Type = discount.Type,
            Value = discount.Value,
            MinimumOrderAmount = discount.MinimumOrderAmount,
            AppliesTo = discount.AppliesTo,
            StartsAt = discount.StartsAt,
            ExpiresAt = discount.ExpiresAt,
            MaxUses = discount.MaxUses,
            UsedCount = discount.UsedCount,
            IsActive = discount.IsActive
        };

        return _responseHandler.Success(
            dto,
            "Discount updated successfully.");
    }
}