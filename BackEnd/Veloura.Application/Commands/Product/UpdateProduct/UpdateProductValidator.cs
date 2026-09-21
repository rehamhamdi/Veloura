using FluentValidation;

namespace Veloura.Application.Commands.Product.UpdateProduct
{
    public class UpdateProductValidator : AbstractValidator<UpdateProductCommand>
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
                .NotNull()
                .Must(file => file.Length > 0)
                .WithMessage("Image file cannot be empty.")
                .Must(file => file.ContentType.StartsWith("image/"))
                .WithMessage("Only image files are allowed.");
        }
    }
}