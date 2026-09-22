using MediatR;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Commands.Discounts.DeleteDiscount;

public record DeleteDiscountCommand(int Id) : IRequest<Response<bool>>;