using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;

namespace Veloura.Application.Commands.Product.UpdateProduct
{
    public class UpdateProductCommand : IRequest<Response<ProductDto>>
    { public int Id { get; set; }

        public UpdateProductDto Product { get; set; } = new();
    }
}
