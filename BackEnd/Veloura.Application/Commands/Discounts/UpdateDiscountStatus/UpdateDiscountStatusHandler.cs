using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Discounts.UpdateDiscountStatus;

public class UpdateDiscountStatusHandler
    : IRequestHandler<UpdateDiscountStatusCommand, Response<DiscountDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public UpdateDiscountStatusHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<DiscountDto>> Handle(
        UpdateDiscountStatusCommand request,
        CancellationToken cancellationToken)
    {
        var discount = await _context.Discounts
            .FirstOrDefaultAsync(
                d => d.Id == request.DiscountId,
                cancellationToken);

        if (discount is null)
            return _responseHandler.NotFound<DiscountDto>(
                "Discount not found.");

        if (discount.IsActive == request.IsActive)
        {
            var currentStatus = request.IsActive ? "active" : "inactive";

            return _responseHandler.BadRequest<DiscountDto>(
                $"Discount is already {currentStatus}.");
        }

        discount.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new DiscountDto
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

        return _responseHandler.Success(
            dto,
            "Discount status updated successfully.");
    }
}