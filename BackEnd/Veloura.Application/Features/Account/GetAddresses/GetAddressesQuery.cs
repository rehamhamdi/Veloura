using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Account.GetAddresses;

public record GetAddressesQuery(int UserId) : IRequest<List<AddressDto>>;