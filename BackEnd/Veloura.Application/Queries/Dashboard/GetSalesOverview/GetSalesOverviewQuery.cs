using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Dashboard;
using Veloura.Domain.Enums;

namespace Veloura.Application.Queries.Dashboard.GetSalesOverview;

public record GetSalesOverviewQuery(SalesOverviewPeriod Period = SalesOverviewPeriod.ThisWeek)
    : IRequest<Response<SalesOverviewDto>>;
