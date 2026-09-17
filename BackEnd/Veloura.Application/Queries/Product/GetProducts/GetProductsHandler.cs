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

namespace Veloura.Application.Queries.Product.GetProducts
{

    public class GetProductsHandler: IRequestHandler<GetProductsQuery, Response<List<ProductDto>>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public GetProductsHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<List<ProductDto>>> Handle(
            GetProductsQuery request,
            CancellationToken cancellationToken)
        {
            var products = await _context.Products
                .Include(p => p.Images)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Category = p.Category,

                    Images = p.Images
                        .OrderBy(i => i.SortOrder)
                        .Select(i => new ProductImageDto
                        {
                            Id = i.Id,
                            Url = i.Url,
                            SortOrder = i.SortOrder
                        })
                        .ToList()
                })
                .ToListAsync(cancellationToken);

            return _responseHandler.Success(products);
        }
    }
}
