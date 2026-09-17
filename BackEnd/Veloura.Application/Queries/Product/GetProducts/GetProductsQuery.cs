using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Product;

namespace Veloura.Application.Queries.Product.GetProducts
{
    public class GetProductsQuery : IRequest<Response<List<ProductDto>>>
    {
    }
}
