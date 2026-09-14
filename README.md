# Veloura E-Commerce Backend

Veloura is an e-commerce backend API built with **ASP.NET Core 10** using **Clean Architecture**, **CQRS**, and **Entity Framework Core**.

The backend provides the foundation for managing users, products, shopping carts, wishlists, addresses, orders, and contact messages.

---

## Tech Stack

* **C# / ASP.NET Core 10**
* **Entity Framework Core 10**
* **SQL Server**
* **MediatR**
* **CQRS**
* **Clean Architecture**
* **Swagger / OpenAPI**
* **Serilog**
* **Git & GitHub**

---

## Architecture

The project follows **Clean Architecture** and is divided into four main layers:

```text
Veloura
│
├── Veloura.Domain
│   ├── Entities
│   ├── Enums
│   └── Common
│
├── Veloura.Application
│   ├── Commands
│   ├── Queries
│   ├── DTOs
│   ├── Common
│   └── DependencyInjection
│
├── Veloura.Infrastructure
│   ├── Persistence
│   │   ├── AppDbContext
│   │   ├── Configurations
│   │   └── Migrations
│   ├── Identity
│   └── DependencyInjection
│
└── Veloura.API
    ├── Controllers
    ├── Common
    └── Program.cs
```

---

## Database

The project uses **SQL Server** with **Entity Framework Core**.

Main entities and relationships:

```text
Users
├── Addresses
├── CartItems ─── Products
├── WishlistItems ─── Products
└── Orders
    ├── Shipping Address
    └── OrderItems ─── Products

Products
└── ProductImages

ContactMessages
```

Entity relationships and database constraints are configured using EF Core configuration classes under:

```text
Veloura.Infrastructure
└── Persistence
    └── Configurations
```

---

##  Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Veloura
```

### 2. Configure the database

Update the connection string in:

```text
Veloura.API/appsettings.json
```

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Initial Catalog=Veloura;Integrated Security=True;Trust Server Certificate=True"
  }
}
```

### 3. Apply database migrations

Using Package Manager Console:

```powershell
Update-Database -Project Veloura.Infrastructure -StartupProject Veloura.API
```

### 4. Run the application

```bash
dotnet run --project Veloura.API
```

---

##  API Documentation

Swagger UI is available in Development mode at:

```text
https://localhost:7235/swagger
```
