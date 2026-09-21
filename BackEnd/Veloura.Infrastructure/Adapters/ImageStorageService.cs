using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Veloura.Application.Interfaces;

namespace Veloura.Infrastructure.Adapters;

public class ImageStorageService : IImageStorageService
{
    private readonly Cloudinary _cloudinary;

    public ImageStorageService(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<string> UploadImageAsync(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null.");

        await using var stream = new MemoryStream();

        await file.CopyToAsync(stream, cancellationToken);
        stream.Position = 0;

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Invalidate = true,
            Overwrite = true
        };

        var result = await _cloudinary.UploadAsync(
            uploadParams,
            cancellationToken);

        if (result.Error != null)
            throw new Exception(
                $"Cloudinary error occurred: {result.Error.Message}");

        return result.SecureUrl?.ToString()
            ?? throw new Exception("Cloudinary returned an empty URL.");
    }
}