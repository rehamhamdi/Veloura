using Microsoft.AspNetCore.Http;
namespace Veloura.Application.Interfaces;


public interface IImageStorageService
{
    Task<string> UploadImageAsync(
        IFormFile file,
        CancellationToken cancellationToken);
}