using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Account
{
    public record UpdateProfileRequest(
    string Name,
    string Email
    );
}
