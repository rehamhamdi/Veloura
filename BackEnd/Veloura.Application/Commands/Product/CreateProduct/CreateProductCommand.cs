using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;

namespace Veloura.Application.Commands.Product.CreateProduct
{
    public class CreateProductCommand : IRequest<Response<ProductDto>>
    {
        public CreateProductDto Product { get; set; } = new();
    }
}
