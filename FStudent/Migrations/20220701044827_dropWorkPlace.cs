using Microsoft.EntityFrameworkCore.Migrations;

namespace FStudent.Migrations
{
    public partial class dropWorkPlace : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkingInfor_Workplace_WorkplaceId",
                table: "WorkingInfor");

            migrationBuilder.DropIndex(
                name: "IX_WorkingInfor_WorkplaceId",
                table: "WorkingInfor");

            migrationBuilder.DropColumn(
                name: "WorkplaceId",
                table: "WorkingInfor");

            migrationBuilder.AddColumn<string>(
                name: "Workplace",
                table: "WorkingInfor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Workplace",
                table: "WorkingInfor");

            migrationBuilder.AddColumn<int>(
                name: "WorkplaceId",
                table: "WorkingInfor",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_WorkingInfor_WorkplaceId",
                table: "WorkingInfor",
                column: "WorkplaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkingInfor_Workplace_WorkplaceId",
                table: "WorkingInfor",
                column: "WorkplaceId",
                principalTable: "Workplace",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
