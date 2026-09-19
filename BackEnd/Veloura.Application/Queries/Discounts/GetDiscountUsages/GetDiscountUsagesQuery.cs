using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Discounts;

namespace Veloura.Application.Queries.Discounts.GetDiscountUsages;

public record GetDiscountUsagesQuery(
    int DiscountId
) : IRequest<Response<List<DiscountUsageDto>>>;