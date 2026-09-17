using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.DTOs.Wishlist;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Commands.Wishlist.AddWishlistItem
{
    public class AddWishlistItemCommand : IRequest<Response<WishlistItemDto>>
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
