using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Cart.RemoveCartItem;

public class RemoveCartItemHandler : IRequestHandler<RemoveCartItemCommand, Response<object>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public RemoveCartItemHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<object>> Handle(RemoveCartItemCommand request, CancellationToken cancellationToken)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == request.CartItemId && c.UserId == request.UserId, cancellationToken);

        if (cartItem is null)
            return _responseHandler.NotFound<object>("Cart item not found.");

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync(cancellationToken);

        return _responseHandler.Deleted<object>("Item removed from cart.");
    }
}
