using MediatR;
using Veloura.Application.Common.DTOs;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Account.UpdateAddress;

public class UpdateAddressHandler : IRequestHandler<UpdateAddressCommand, AddressDto>
{
    private readonly IAddressRepository _addressRepository;

    public UpdateAddressHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<AddressDto> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _addressRepository.GetByIdAsync(request.AddressId, cancellationToken);

        // An address that doesn't exist and an address that belongs to another user
        // are deliberately treated the same way (404), so requests can never be used
        // to confirm the existence of another user's address.
        if (address is null || address.UserId != request.UserId)
            throw new NotFoundException(nameof(Address), request.AddressId);

        address.Label = request.Label;
        address.Street = request.Street;
        address.City = request.City;
        address.State = request.State;
        address.PostalCode = request.PostalCode;
        address.Country = request.Country;
        address.IsDefault = request.IsDefault;

        await _addressRepository.UpdateAsync(address, cancellationToken);

        return new AddressDto
        {
            Id = address.Id,
            Label = address.Label,
            Street = address.Street,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country,
            IsDefault = address.IsDefault
        };
    }
}
