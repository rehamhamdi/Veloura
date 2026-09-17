using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.Commands.Wishlist.RemoveWishlistItem
{
    public class RemoveWishlistItemValidator
    : AbstractValidator<RemoveWishlistItemCommand>
    {
        public RemoveWishlistItemValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.ProductId)
                .GreaterThan(0);
        }
    }
}
