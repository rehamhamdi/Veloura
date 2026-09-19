using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;

namespace Veloura.Application.Queries.Discounts.GetAllDiscounts;

public record GetAllDiscountsQuery : IRequest<Response<List<DiscountDto>>>;