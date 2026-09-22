using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Product.UpdateProduct
{
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Response<ProductDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;
        private readonly IImageStorageService _imageStorageService;

        public UpdateProductHandler(
            IAppDbContext context,
            ResponseHandler responseHandler,
            IImageStorageService imageStorageService)
        {
            _context = context;
            _responseHandler = responseHandler;
            _imageStorageService = imageStorageService;
        }

        public async Task<Response<ProductDto>> Handle(
            UpdateProductCommand request,
            CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(
                    p => p.Id == request.Id,
                    cancellationToken);

            if (product == null)
            {
                return _responseHandler.NotFound<ProductDto>(
                    "Product not found");
            }

            var dto = request.Product;

            // Update product information
            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.Category = dto.Category;
            product.UpdatedAt = DateTime.UtcNow;

            // Update images only when new images are provided
            if (dto.Images != null && dto.Images.Count > 0)
            {
                product.Images.Clear();

                for (var i = 0; i < dto.Images.Count; i++)
                {
                    var image = dto.Images[i];

                    var imageUrl = await _imageStorageService.UploadImageAsync(
                        image,
                        cancellationToken);

                    product.Images.Add(new Domain.Entities.ProductImage
                    {
                        Url = imageUrl,
                        SortOrder = i
                    });
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            var result = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,
                Images = product.Images
                    .Select(i => new ProductImageDto
                    {
                        Id = i.Id,
                        Url = i.Url,
                        SortOrder = i.SortOrder
                    })
                    .ToList()
            };

            return _responseHandler.Success(result);
        }
    }
}