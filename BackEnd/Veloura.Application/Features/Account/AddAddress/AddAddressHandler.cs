using MediatR;
using Veloura.Application.DTOs.Account;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Account.AddAddress;

public class AddAddressHandler : IRequestHandler<AddAddressCommand, AddressDto>
{
    private readonly IAddressRepository _addressRepository;

    public AddAddressHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<AddressDto> Handle(AddAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.IsDefault)
            await _addressRepository.UnsetDefaultForUserAsync(request.UserId, cancellationToken);

        var address = new Address
        {
            UserId = request.UserId,
            Label = request.Label,
            Street = request.Street,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Country = request.Country,
            IsDefault = request.IsDefault
        };

        await _addressRepository.AddAsync(address, cancellationToken);

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