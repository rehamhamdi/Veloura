using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Veloura.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlignDiscountSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Discounts_Value_Positive",
                table: "Discounts");

            migrationBuilder.AddColumn<string>(
                name: "AppliesTo",
                table: "Discounts",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "All products");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Discounts",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Discounts",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "Untitled Discount");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Discounts_Value_NonNegative",
                table: "Discounts",
                sql: "[Value] >= 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Discounts_Value_NonNegative",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "AppliesTo",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Discounts");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Discounts");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Discounts_Value_Positive",
                table: "Discounts",
                sql: "[Value] > 0");
        }
    }
}