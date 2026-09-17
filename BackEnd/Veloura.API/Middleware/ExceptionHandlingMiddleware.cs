using System.Net;
using System.Text.Json;
using FluentValidation;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Common.Wrappers;

namespace Veloura.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly ResponseHandler _responseHandler;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        ResponseHandler responseHandler)
    {
        _next = next;
        _logger = logger;
        _responseHandler = responseHandler;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            Response<object?> response;

            switch (ex)
            {
                case ValidationException validationException:
                    response = _responseHandler.BadRequest<object?>(
                        "Validation failed.");

                    response.Errors = validationException.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    break;

                case EmailAlreadyExistsException:
                    response = _responseHandler.Conflict<object?>(
                        ex.Message);

                    break;

                case InvalidCredentialsException:
                    response = _responseHandler.Unauthorized<object?>(
                        ex.Message);

                    break;

                case InvalidCurrentPasswordException:
                    response = _responseHandler.BadRequest<object?>(
                        ex.Message);

                    break;

                case NotFoundException:
                    response = _responseHandler.NotFound<object?>(
                        ex.Message);

                    break;

                default:
                    _logger.LogError(ex, "Unhandled exception");

                    response = _responseHandler.InternalServerError<object?>(
                        "An unexpected error occurred.");

                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)response.StatusCode;

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response, options));
        }
    }
}