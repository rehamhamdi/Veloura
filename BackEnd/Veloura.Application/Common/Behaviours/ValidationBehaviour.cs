using System.Net;
using FluentValidation;
using MediatR;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Common.Behaviours;
public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);

        var failures = (await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken))))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        if (failures.Count == 0)
            return await next();

        var errorMessages = failures.Select(f => f.ErrorMessage).Distinct().ToList();

        var responseType = typeof(TResponse);
        if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(Response<>))
        {
            var response = Activator.CreateInstance(responseType)!;
            responseType.GetProperty(nameof(Response<object>.Succeeded))!.SetValue(response, false);
            responseType.GetProperty(nameof(Response<object>.StatusCode))!.SetValue(response, HttpStatusCode.BadRequest);
            responseType.GetProperty(nameof(Response<object>.Message))!.SetValue(response, "Validation failed.");
            responseType.GetProperty(nameof(Response<object>.Errors))!.SetValue(response, errorMessages);
            return (TResponse)response;
        }

        throw new ValidationException(failures);
    }
}
