using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Product.UpdateProduct
{
    public class UpdateProductHandler: IRequestHandler<UpdateProductCommand, Response<ProductDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public UpdateProductHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
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

            product.Title = dto.Title;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.Category = dto.Category;
            product.UpdatedAt = DateTime.UtcNow;

            product.Images.Clear();

            foreach (var image in dto.Images)
            {
                product.Images.Add(new Domain.Entities.ProductImage
                {
                    Url = image.Url,
                    SortOrder = image.SortOrder
                });
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
