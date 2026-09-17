using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;

namespace Veloura.Application.Queries.Product.GetProductById
{
    public class GetProductByIdQuery : IRequest<Response<ProductDto>>
    {
        public int Id { get; set; }
    }
}
