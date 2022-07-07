using Microsoft.EntityFrameworkCore.Migrations;

namespace FStudent.Migrations
{
    public partial class v2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfileSecurity",
                columns: table => new
                {
                    ProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsValidate = table.Column<bool>(type: "bit", nullable: false),
                    AccessProfile = table.Column<int>(type: "int", nullable: false),
                    AccessLearningInfor = table.Column<int>(type: "int", nullable: false),
                    AccessDateOfBirth = table.Column<int>(type: "int", nullable: false),
                    AccessPhoneNumber = table.Column<int>(type: "int", nullable: false),
                    AccessEmail = table.Column<int>(type: "int", nullable: false),
                    AccessSkype = table.Column<int>(type: "int", nullable: false),
                    AccessZalo = table.Column<int>(type: "int", nullable: false),
                    AccessFacebook = table.Column<int>(type: "int", nullable: false),
                    AccessLinkedIn = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileSecurity", x => x.ProfileId);
                    table.ForeignKey(
                        name: "FK_ProfileSecurity_Profile_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileSecurity");
        }
    }
}
