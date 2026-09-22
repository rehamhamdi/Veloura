using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Veloura.Application.Interfaces;

namespace Veloura.Infrastructure.Adapters
{
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

        public async Task DeleteImageAsync(
            string imageUrl,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            var publicId = ExtractPublicId(imageUrl);

            if (string.IsNullOrWhiteSpace(publicId))
                return;

            var deletionParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image,
                Type = "upload",
                Invalidate = true
            };

            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Error != null)
            {
                throw new Exception(
                    $"Cloudinary delete error occurred: {result.Error.Message}");
            }
        }

        private static string ExtractPublicId(string imageUrl)
        {
            var uri = new Uri(imageUrl);

            var path = uri.AbsolutePath;

            var uploadIndex = path.IndexOf(
                "/upload/",
                StringComparison.OrdinalIgnoreCase);

            if (uploadIndex == -1)
                return string.Empty;

            var publicIdWithExtension = path[
                (uploadIndex + "/upload/".Length)..];

            // Remove version: /v123456789/
            if (publicIdWithExtension.StartsWith("v"))
            {
                var slashIndex = publicIdWithExtension.IndexOf('/');

                if (slashIndex > 0)
                {
                    var version = publicIdWithExtension[..slashIndex];

                    if (version.Skip(1).All(char.IsDigit))
                    {
                        publicIdWithExtension =
                            publicIdWithExtension[(slashIndex + 1)..];
                    }
                }
            }

            // Remove file extension
            var extensionIndex = publicIdWithExtension.LastIndexOf('.');

            if (extensionIndex > 0)
            {
                publicIdWithExtension =
                    publicIdWithExtension[..extensionIndex];
            }

            return Uri.UnescapeDataString(publicIdWithExtension);
        }
    }
}