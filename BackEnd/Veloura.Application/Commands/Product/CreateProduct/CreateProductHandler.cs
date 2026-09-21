using MediatR;
using ProductEntity = Veloura.Domain.Entities.Product;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Product.CreateProduct
{
    public class CreateProductHandler : IRequestHandler<CreateProductCommand, Response<ProductDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;
        private readonly IImageStorageService _imageStorageService;

        public CreateProductHandler(
            IAppDbContext context,
            ResponseHandler responseHandler,
            IImageStorageService imageStorageService)
        {
            _context = context;
            _responseHandler = responseHandler;
            _imageStorageService = imageStorageService;
        }

        public async Task<Response<ProductDto>> Handle(
            CreateProductCommand request,
            CancellationToken cancellationToken)
        {
            var dto = request.Product;

            var product = new ProductEntity
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                Category = dto.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            for (var i = 0; i < dto.Images.Count; i++)
            {
                var image = dto.Images[i];

                var imageUrl = await _imageStorageService.UploadImageAsync(
                    image,
                    cancellationToken);

                product.Images.Add(new ProductImage
                {
                    Url = imageUrl,
                    SortOrder = i
                });
            }

            await _context.Products.AddAsync(product, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            var result = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                Images = product.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    Url = i.Url,
                    SortOrder = i.SortOrder
                }).ToList()
            };

            return _responseHandler.Success(result);
        }
    }
}