using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Veloura.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceResetTokenWithOtp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordResetTokenExpiresAt",
                table: "Users",
                newName: "OtpExpiresAt");

            migrationBuilder.RenameColumn(
                name: "PasswordResetToken",
                table: "Users",
                newName: "OtpCodeHash");

            migrationBuilder.AddColumn<int>(
                name: "OtpAttempts",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OtpAttempts",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "OtpExpiresAt",
                table: "Users",
                newName: "PasswordResetTokenExpiresAt");

            migrationBuilder.RenameColumn(
                name: "OtpCodeHash",
                table: "Users",
                newName: "PasswordResetToken");
        }
    }
}
