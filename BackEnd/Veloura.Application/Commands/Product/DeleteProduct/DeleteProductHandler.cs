using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Product.DeleteProduct
{

    public class DeleteProductHandler: IRequestHandler<DeleteProductCommand, Response<bool>>
    {
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public DeleteProductHandler(
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<bool>> Handle(
            DeleteProductCommand request,
            CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(
                    p => p.Id == request.Id,
                    cancellationToken);

            if (product == null)
            {
                return _responseHandler.NotFound<bool>(
                    "Product not found");
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync(cancellationToken);

            return _responseHandler.Deleted<bool>(
                "Product deleted successfully");
        }
    }
}
