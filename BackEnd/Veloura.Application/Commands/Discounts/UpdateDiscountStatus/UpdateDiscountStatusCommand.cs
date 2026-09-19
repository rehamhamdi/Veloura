using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;

namespace Veloura.Application.Commands.Discounts.UpdateDiscountStatus;

public record UpdateDiscountStatusCommand(
    int DiscountId,
    bool IsActive
) : IRequest<Response<DiscountDto>>;