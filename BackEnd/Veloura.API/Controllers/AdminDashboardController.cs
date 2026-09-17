using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Queries.Dashboard.GetRecentOrders;
using Veloura.Application.Queries.Dashboard.GetSalesOverview;
using Veloura.Application.Queries.Dashboard.GetSummary;
using Veloura.Application.Queries.Dashboard.GetTopProducts;
using Veloura.Domain.Enums;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly ISender _mediator;

    public AdminDashboardController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetSummaryQuery(), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("sales-overview")]
    public async Task<IActionResult> GetSalesOverview(
        [FromQuery] SalesOverviewPeriod period = SalesOverviewPeriod.ThisWeek,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(new GetSalesOverviewQuery(period), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int limit = 3, CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(new GetTopProductsQuery(limit), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("recent-orders")]
    public async Task<IActionResult> GetRecentOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 4,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(new GetRecentOrdersQuery(page, pageSize), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }
}
