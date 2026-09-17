using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Wishlist;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Wishlist.AddWishlistItem
{
    public class AddWishlistItemHandler: IRequestHandler<AddWishlistItemCommand, Response<WishlistItemDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public AddWishlistItemHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<WishlistItemDto>> Handle(
            AddWishlistItemCommand request,
            CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(
                    p => p.Id == request.ProductId,
                    cancellationToken);

            if (product == null)
            {
                return _responseHandler.NotFound<WishlistItemDto>(
                    "Product not found");
            }

            var existingItem = await _context.WishlistItems
                .FirstOrDefaultAsync(
                    w => w.UserId == request.UserId &&
                         w.ProductId == request.ProductId,
                    cancellationToken);

            if (existingItem != null)
            {
                return _responseHandler.BadRequest<WishlistItemDto>(
                    "Product already exists in wishlist");
            }

            var item = new WishlistItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.WishlistItems.AddAsync(
                item,
                cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            var result = new WishlistItemDto
            {
                Id = item.Id,
                UserId = item.UserId,
                ProductId = item.ProductId,
                ProductTitle = product.Title,
                Price = product.Price,
                ProductImageUrl = product.Images
                    .OrderBy(i => i.SortOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault(),
                CreatedAt = item.CreatedAt
            };

            return _responseHandler.Created(result);
        }
    }
}
