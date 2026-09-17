using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;

namespace Veloura.Application.Queries.Dashboard.GetSummary;

public record GetSummaryQuery : IRequest<Response<DashboardSummaryDto>>;
