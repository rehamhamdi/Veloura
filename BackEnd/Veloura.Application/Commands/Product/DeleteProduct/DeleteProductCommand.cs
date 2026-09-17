using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Commands.Product.DeleteProduct
{
    public class DeleteProductCommand : IRequest<Response<bool>>
    {
        public int Id { get; set; }
    }
}
