using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProductEntity = Veloura.Domain.Entities.Product;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Product.CreateProduct
{
    public class CreateProductHandler: IRequestHandler<CreateProductCommand, Response<ProductDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public CreateProductHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
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

            foreach (var image in dto.Images)
            {
                product.Images.Add(new ProductImage
                {
                    Url = image.Url,
                    SortOrder = image.SortOrder
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
