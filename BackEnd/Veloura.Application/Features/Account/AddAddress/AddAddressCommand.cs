using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Account.AddAddress;

public record AddAddressCommand(
    int UserId,
    string? Label,
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault) : IRequest<AddressDto>;
