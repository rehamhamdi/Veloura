using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Veloura.Application.Common.Behaviors;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Interfaces;
using Veloura.Application.Services;

namespace Veloura.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
        });

        services.AddValidatorsFromAssembly(assembly);

        services.AddSingleton<ResponseHandler>();   
        services.AddScoped<IPaymentService, PaymentService>();

        return services;
    }
}