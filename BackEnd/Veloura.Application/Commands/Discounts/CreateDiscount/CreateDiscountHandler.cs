using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Discounts.CreateDiscount;

public class CreateDiscountHandler : IRequestHandler<CreateDiscountCommand, Response<DiscountDto>>
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

        var code = dto.Code.Trim().ToUpperInvariant();

        var exists = await _context.Discounts
            .AnyAsync(d => d.Code == code, cancellationToken);

        if (exists)
        {
            return _responseHandler.Conflict<DiscountDto>(
                "A discount with this code already exists.");
        }

        var discount = new Discount
        {
            Code = code,
            Type = dto.Type,
            Value = dto.Value,
            MinimumOrderAmount = dto.MinimumOrderAmount,
            StartsAt = dto.StartsAt,
            ExpiresAt = dto.ExpiresAt,
            MaxUses = dto.MaxUses,
            UsedCount = 0,
            IsActive = true
        };

        await _context.Discounts.AddAsync(discount, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        var result = new DiscountDto
        {
            Id = discount.Id,
            Code = discount.Code,
            Type = discount.Type,
            Value = discount.Value,
            MinimumOrderAmount = discount.MinimumOrderAmount,
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