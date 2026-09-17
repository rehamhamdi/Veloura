using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace Veloura.Application.Commands.Product.UpdateProduct
{

    public class UpdateProductValidator: AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0);

            RuleFor(x => x.Product.Title)
                .NotEmpty()
                .MaximumLength(250);

            RuleFor(x => x.Product.Price)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Product.Stock)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Product.Category)
                .MaximumLength(100)
                .When(x => !string.IsNullOrEmpty(x.Product.Category));

            RuleForEach(x => x.Product.Images)
                .ChildRules(image =>
                {
                    image.RuleFor(i => i.Url)
                        .NotEmpty()
                        .MaximumLength(500);

                    image.RuleFor(i => i.SortOrder)
                        .GreaterThanOrEqualTo(0);
                });
        }
    }
}
