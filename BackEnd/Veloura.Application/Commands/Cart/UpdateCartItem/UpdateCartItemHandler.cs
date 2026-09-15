using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs;
using Veloura.Application.DTOs.Cart;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Cart.UpdateCartItem;

public class UpdateCartItemHandler : IRequestHandler<UpdateCartItemCommand, Response<CartItemDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public UpdateCartItemHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<CartItemDto>> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var cartItem = await _context.CartItems
            .Include(c => c.Product)
            .FirstOrDefaultAsync(c => c.Id == request.CartItemId && c.UserId == request.UserId, cancellationToken);

        if (cartItem is null)
            return _responseHandler.NotFound<CartItemDto>("Cart item not found.");

        if (request.Quantity > cartItem.Product.Stock)
            return _responseHandler.UnprocessableEntity<CartItemDto>(
                $"Only {cartItem.Product.Stock} unit(s) of '{cartItem.Product.Title}' left in stock.");

        cartItem.Quantity = request.Quantity;
        await _context.SaveChangesAsync(cancellationToken);

        var dto = new CartItemDto
        {
            Id = cartItem.Id,
            ProductId = cartItem.ProductId,
            ProductTitle = cartItem.Product.Title,
            UnitPrice = cartItem.Product.Price,
            Quantity = cartItem.Quantity,
            AvailableStock = cartItem.Product.Stock
        };

        return _responseHandler.Success(dto, "Cart item updated.");
    }
}
