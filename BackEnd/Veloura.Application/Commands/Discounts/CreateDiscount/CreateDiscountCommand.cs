using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;

namespace Veloura.Application.Commands.Discounts.CreateDiscount;

public class CreateDiscountCommand : IRequest<Response<DiscountDto>>
{
    public CreateDiscountDto Discount { get; set; } = new();
}