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

namespace Veloura.Application.Queries.Product.GetProductById
{
    public class GetProductByIdHandler: IRequestHandler<GetProductByIdQuery, Response<ProductDto>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public GetProductByIdHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<ProductDto>> Handle(
            GetProductByIdQuery request,
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

            var result = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                Category = product.Category,

                Images = product.Images
                    .OrderBy(i => i.SortOrder)
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
