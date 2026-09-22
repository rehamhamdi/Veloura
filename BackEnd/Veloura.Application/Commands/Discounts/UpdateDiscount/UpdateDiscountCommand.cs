using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;

namespace Veloura.Application.Commands.Discounts.UpdateDiscount;

public record UpdateDiscountCommand(
    int Id,
    CreateDiscountDto Discount
) : IRequest<Response<DiscountDto>>;