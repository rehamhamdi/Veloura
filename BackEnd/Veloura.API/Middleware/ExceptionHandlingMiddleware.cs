using System.Net;
using System.Text.Json;
using FluentValidation;
using Veloura.Application.Common.Exceptions;

namespace Veloura.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, message) = ex switch
            {
                ValidationException v => (HttpStatusCode.BadRequest, string.Join(" | ", v.Errors.Select(e => e.ErrorMessage))),
                EmailAlreadyExistsException => (HttpStatusCode.Conflict, ex.Message),
                InvalidCredentialsException => (HttpStatusCode.Unauthorized, ex.Message),
                NotFoundException => (HttpStatusCode.NotFound, ex.Message),
                _ => (HttpStatusCode.InternalServerError, ex.Message)
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(ex, "Unhandled exception");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }));
        }
    }
}