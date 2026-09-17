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

namespace Veloura.Application.Queries.Wishlist.GetWishlist
{

    public class GetWishlistHandler
        : IRequestHandler<GetWishlistQuery, Response<List<WishlistItemDto>>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public GetWishlistHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<List<WishlistItemDto>>> Handle(
            GetWishlistQuery request,
            CancellationToken cancellationToken)
        {
            var items = await _context.WishlistItems
                .Include(w => w.Product)
                .ThenInclude(p => p.Images)
                .Where(w => w.UserId == request.UserId)
                .Select(w => new WishlistItemDto
                {
                    Id = w.Id,
                    UserId = w.UserId,
                    ProductId = w.ProductId,
                    ProductTitle = w.Product.Title,
                    Price = w.Product.Price,
                    ProductImageUrl = w.Product.Images
                        .OrderBy(i => i.SortOrder)
                        .Select(i => i.Url)
                        .FirstOrDefault(),
                    CreatedAt = w.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return _responseHandler.Success(items);
        }
    }
}
