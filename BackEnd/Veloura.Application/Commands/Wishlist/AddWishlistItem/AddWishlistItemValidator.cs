using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.Commands.Wishlist.AddWishlistItem
{
    public class AddWishlistItemValidator
     : AbstractValidator<AddWishlistItemCommand>
    {
        public AddWishlistItemValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.ProductId)
                .GreaterThan(0);
        }
    }
}
