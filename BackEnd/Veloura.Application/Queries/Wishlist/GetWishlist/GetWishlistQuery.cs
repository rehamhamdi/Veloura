using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Wishlist;

namespace Veloura.Application.Queries.Wishlist.GetWishlist
{
    public class GetWishlistQuery : IRequest<Response<List<WishlistItemDto>>>
    {
        public int UserId { get; set; }
    }
}
