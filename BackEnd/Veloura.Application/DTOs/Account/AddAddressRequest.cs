using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Account
{
    public record AddAddressRequest(
    string? Label,
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault);

}
