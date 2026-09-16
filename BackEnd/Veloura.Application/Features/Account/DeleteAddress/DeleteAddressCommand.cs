using MediatR;

namespace Veloura.Application.Features.Account.DeleteAddress;

public record DeleteAddressCommand(int UserId, int AddressId) : IRequest;
