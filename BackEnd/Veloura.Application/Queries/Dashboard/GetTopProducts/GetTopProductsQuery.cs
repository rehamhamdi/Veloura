using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;

namespace Veloura.Application.Queries.Dashboard.GetTopProducts;

public record GetTopProductsQuery(int Limit = 3) : IRequest<Response<List<TopProductDto>>>;
