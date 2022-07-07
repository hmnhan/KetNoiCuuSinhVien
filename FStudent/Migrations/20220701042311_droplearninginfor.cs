using Microsoft.EntityFrameworkCore.Migrations;

namespace FStudent.Migrations
{
    public partial class droplearninginfor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessLearningInfor",
                table: "ProfileSecurity");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccessLearningInfor",
                table: "ProfileSecurity",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
