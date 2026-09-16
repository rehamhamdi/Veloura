using System.Net;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Common.Wrappers;

public class ResponseHandler
{
    public Response<T> Success<T>(T entity, string? message = null) => new()
    {
        Data = entity,
        StatusCode = HttpStatusCode.OK,
        Succeeded = true,
        Message = message
    };

    public Response<T> Created<T>(T entity, string? message = null) => new()
    {
        Data = entity,
        StatusCode = HttpStatusCode.Created,
        Succeeded = true,
        Message = message
    };

    public Response<T> Deleted<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.OK,
        Succeeded = true,
        Message = message
    };

    public Response<T> NotFound<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.NotFound,
        Succeeded = false,
        Message = message
    };

    public Response<T> BadRequest<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.BadRequest,
        Succeeded = false,
        Message = message
    };

    public Response<T> Unauthorized<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.Unauthorized,
        Succeeded = false,
        Message = message
    };

    public Response<T> Forbidden<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.Forbidden,
        Succeeded = false,
        Message = message
    };

    public Response<T> UnprocessableEntity<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.UnprocessableEntity,
        Succeeded = false,
        Message = message
    };

    public Response<T> Conflict<T>(string? message = null) => new()
    {
        StatusCode = HttpStatusCode.Conflict,
        Succeeded = false,
        Message = message
    };

    public Response<T> InternalServerError<T>(string? message = "An unexpected error occurred") => new()
    {
        StatusCode = HttpStatusCode.InternalServerError,
        Succeeded = false,
        Message = message
    };
}