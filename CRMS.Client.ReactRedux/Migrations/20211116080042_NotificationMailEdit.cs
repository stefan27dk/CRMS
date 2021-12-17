using Microsoft.EntityFrameworkCore.Migrations;

namespace CRMS.Client.ReactRedux.Migrations
{
    public partial class NotificationMailEdit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Mail",
                table: "NotificationMails",
                newName: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationMails_Email",
                table: "NotificationMails",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Domains_DomainName",
                table: "Domains",
                column: "DomainName",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_NotificationMails_Email",
                table: "NotificationMails");

            migrationBuilder.DropIndex(
                name: "IX_Domains_DomainName",
                table: "Domains");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "NotificationMails",
                newName: "Mail");
        }
    }
}
