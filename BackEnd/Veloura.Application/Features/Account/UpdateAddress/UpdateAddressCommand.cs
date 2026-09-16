using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Account.UpdateAddress;

public record UpdateAddressCommand(
    int UserId,
    int AddressId,
    string? Label,
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault) : IRequest<AddressDto>;
