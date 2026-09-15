using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs;
using Veloura.Application.DTOs.Cart;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Cart.AddCartItem;

public class AddCartItemHandler : IRequestHandler<AddCartItemCommand, Response<CartItemDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public AddCartItemHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<CartItemDto>> Handle(AddCartItemCommand request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

        if (product is null)
            return _responseHandler.NotFound<CartItemDto>("Product not found.");

        var existing = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == request.UserId && c.ProductId == request.ProductId, cancellationToken);

        var requestedTotalQty = (existing?.Quantity ?? 0) + request.Quantity;

        if (requestedTotalQty > product.Stock)
            return _responseHandler.UnprocessableEntity<CartItemDto>(
                $"Only {product.Stock} unit(s) of '{product.Title}' left in stock.");

        if (existing is not null)
        {
            existing.Quantity = requestedTotalQty;
        }
        else
        {
            existing = new CartItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            _context.CartItems.Add(existing);
        }

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new CartItemDto
        {
            Id = existing.Id,
            ProductId = product.Id,
            ProductTitle = product.Title,
            UnitPrice = product.Price,
            Quantity = existing.Quantity,
            AvailableStock = product.Stock
        };

        return _responseHandler.Created(dto, "Item added to cart.");
    }
}
