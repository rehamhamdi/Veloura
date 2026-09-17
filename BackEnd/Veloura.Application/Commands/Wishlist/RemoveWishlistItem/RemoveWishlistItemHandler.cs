using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Wishlist.RemoveWishlistItem
{

    public class RemoveWishlistItemHandler
        : IRequestHandler<RemoveWishlistItemCommand, Response<bool>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public RemoveWishlistItemHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<bool>> Handle(
            RemoveWishlistItemCommand request,
            CancellationToken cancellationToken)
        {
            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(
                    w => w.UserId == request.UserId &&
                         w.ProductId == request.ProductId,
                    cancellationToken);

            if (item == null)
            {
                return _responseHandler.NotFound<bool>(
                    "Product not found in wishlist");
            }

            _context.WishlistItems.Remove(item);

            await _context.SaveChangesAsync(cancellationToken);

            return _responseHandler.Deleted<bool>(
                "Product removed from wishlist");
        }
    }
}
