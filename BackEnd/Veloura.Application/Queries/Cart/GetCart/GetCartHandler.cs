using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs;
using Veloura.Application.DTOs.Cart;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Cart.GetCart;

public class GetCartHandler : IRequestHandler<GetCartQuery, Response<CartDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetCartHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<CartDto>> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var items = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == request.UserId)
            .Select(c => new CartItemDto
            {
                Id = c.Id,
                ProductId = c.ProductId,
                ProductTitle = c.Product.Title,
                ProductImageUrl = c.Product.Images
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault(),
                UnitPrice = c.Product.Price,
                Quantity = c.Quantity,
                AvailableStock = c.Product.Stock
            })
            .ToListAsync(cancellationToken);

        return _responseHandler.Success(new CartDto { Items = items });
    }
}
