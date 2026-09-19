using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using Veloura.Application.Interfaces;
using Veloura.Infrastructure.PaymentGateways;
using Veloura.Infrastructure.Persistence;
using Veloura.Infrastructure.Repositories;
using Veloura.Infrastructure.Security;

namespace Veloura.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionMode = configuration["ConnectionMode"];

        var connectionString = connectionMode?.Equals("Prod", StringComparison.OrdinalIgnoreCase) == true
            ? configuration.GetConnectionString("ProdCS")
            : configuration.GetConnectionString("DevCS");

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IAppDbContext>(sp =>
            sp.GetRequiredService<AppDbContext>());

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<IAddressRepository, EfAddressRepository>();
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<IAddressRepository, EfAddressRepository>();

        services.AddScoped<IProductRepository, EfProductRepository>();
        services.AddScoped<IProductImageRepository, EfProductImageRepository>();
        services.AddScoped<IWishlistItemRepository, EfWishlistItemRepository>();
        services.AddScoped<IPaymentRepository, EfPaymentRepository>();
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPaymentGateway, MockPaymentGateway>();
        return services;
    }
}