using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Discounts.DeleteDiscount;

public class DeleteDiscountHandler
    : IRequestHandler<DeleteDiscountCommand, Response<bool>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public DeleteDiscountHandler(
        IAppDbContext context,
        ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<bool>> Handle(
        DeleteDiscountCommand request,
        CancellationToken cancellationToken)
    {
        var discount = await _context.Discounts
            .FirstOrDefaultAsync(
                d => d.Id == request.Id,
                cancellationToken);

        if (discount is null)
        {
            return _responseHandler.NotFound<bool>(
                "Discount not found.");
        }

        _context.Discounts.Remove(discount);

        await _context.SaveChangesAsync(cancellationToken);

        return _responseHandler.Success(
            true,
            "Discount deleted successfully.");
    }
}