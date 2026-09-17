using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.Commands.Product.CreateProduct
{

    public class CreateProductValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductValidator()
        {
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
