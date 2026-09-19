using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Wishlist.AddWishlistItem;
using Veloura.Application.Commands.Wishlist.RemoveWishlistItem;
using Veloura.Application.Queries.Wishlist.GetWishlist;

namespace Veloura.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WishlistController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = "Buyer")]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(int userId)
        {
            var result = await _mediator.Send(
                new GetWishlistQuery { UserId = userId });

            return StatusCode((int)result.StatusCode, result);
        }

        [Authorize(Roles = "Buyer")]
        [HttpPost]
        public async Task<IActionResult> AddToWishlist(
            AddWishlistItemCommand command)
        {
            var result = await _mediator.Send(command);

            return StatusCode((int)result.StatusCode, result);
        }
        [Authorize(Roles = "Buyer")]
        [HttpDelete]
        public async Task<IActionResult> RemoveFromWishlist(
            RemoveWishlistItemCommand command)
        {
            var result = await _mediator.Send(command);

            return StatusCode((int)result.StatusCode, result);
        }

    }
}
