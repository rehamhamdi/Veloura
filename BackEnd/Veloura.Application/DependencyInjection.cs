// Application/DependencyInjection.cs
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Veloura.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        //  FluentValidation 
        // services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}