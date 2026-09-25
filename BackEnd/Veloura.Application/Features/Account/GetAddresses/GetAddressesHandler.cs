using MediatR;
using Veloura.Application.DTOs.Account;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Features.Account.GetAddresses;

public class GetAddressesHandler : IRequestHandler<GetAddressesQuery, List<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;

    public GetAddressesHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<List<AddressDto>> Handle(GetAddressesQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _addressRepository.GetByUserIdAsync(request.UserId, cancellationToken);

        return addresses.Select(a => new AddressDto
        {
            Id = a.Id,
            Label = a.Label,
            Street = a.Street,
            City = a.City,
            State = a.State,
            PostalCode = a.PostalCode,
            Country = a.Country,
            IsDefault = a.IsDefault
        }).ToList();
    }
}