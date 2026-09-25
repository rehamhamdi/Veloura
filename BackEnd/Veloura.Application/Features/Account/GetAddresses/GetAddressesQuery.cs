using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Account.GetAddresses;

public record GetAddressesQuery(int UserId) : IRequest<List<AddressDto>>;