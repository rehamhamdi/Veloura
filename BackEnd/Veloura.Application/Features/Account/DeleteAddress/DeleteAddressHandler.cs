using MediatR;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Account.DeleteAddress;

public class DeleteAddressHandler : IRequestHandler<DeleteAddressCommand>
{
    private readonly IAddressRepository _addressRepository;

    public DeleteAddressHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _addressRepository.GetByIdAsync(request.AddressId, cancellationToken);

        // Same 404-for-both rule as UpdateAddress: never confirm another user's
        // address exists.
        if (address is null || address.UserId != request.UserId)
            throw new NotFoundException(nameof(Address), request.AddressId);

        await _addressRepository.DeleteAsync(address, cancellationToken);
    }
}
