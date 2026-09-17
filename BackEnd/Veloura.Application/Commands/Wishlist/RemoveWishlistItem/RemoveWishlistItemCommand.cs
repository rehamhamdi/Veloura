using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Commands.Wishlist.RemoveWishlistItem
{
    public class RemoveWishlistItemCommand : IRequest<Response<bool>>
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
