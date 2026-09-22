using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Discounts.CreateDiscount;

public class CreateDiscountHandler
    : IRequestHandler<CreateDiscountCommand, Response<DiscountDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public CreateDiscountHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<DiscountDto>> Handle(
        CreateDiscountCommand request,
        CancellationToken cancellationToken)
    {
        var dto = request.Discount;

        var normalizedCode = dto.Code
            .Trim()
            .ToUpperInvariant();

        var exists = await _context.Discounts
            .AnyAsync(
                d => d.Code == normalizedCode,
                cancellationToken);

        if (exists)
        {
            return _responseHandler.BadRequest<DiscountDto>(
                "Discount code already exists.");
        }

        var discount = new Discount
        {
            Code = normalizedCode,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Type = dto.Type,
            Value = dto.Value,
            MinimumOrderAmount = dto.MinimumOrderAmount,
            AppliesTo = dto.AppliesTo.Trim(),
            StartsAt = dto.StartsAt,
            ExpiresAt = dto.ExpiresAt,
            MaxUses = dto.MaxUses,
            UsedCount = 0,
            IsActive = true
        };

        _context.Discounts.Add(discount);

        await _context.SaveChangesAsync(cancellationToken);

        var result = new DiscountDto
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

        return _responseHandler.Created(
            result,
            "Discount created successfully.");
    }
}