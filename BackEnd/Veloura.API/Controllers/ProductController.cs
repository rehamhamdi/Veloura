using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Product.CreateProduct;
using Veloura.Application.Commands.Product.DeleteProduct;
using Veloura.Application.Commands.Product.UpdateProduct;
using Veloura.Application.Queries.Product.GetProductById;
using Veloura.Application.Queries.Product.GetProducts;

namespace Veloura.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var result = await _mediator.Send(new GetProductsQuery());

            return StatusCode((int)result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var result = await _mediator.Send(
                new GetProductByIdQuery { Id = id });

            return StatusCode((int)result.StatusCode, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct(
            CreateProductCommand command)
        {
            var result = await _mediator.Send(command);

            return StatusCode((int)result.StatusCode, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            UpdateProductCommand command)
        {
            command.Id = id;

            var result = await _mediator.Send(command);

            return StatusCode((int)result.StatusCode, result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _mediator.Send(
                new DeleteProductCommand { Id = id });

            return StatusCode((int)result.StatusCode, result);
        }
    }
}
