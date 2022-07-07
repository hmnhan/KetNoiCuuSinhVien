using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class RoleVM
    {
        public IEnumerable<IdentityRole> IdentityRoles { get; set; }
        public IdentityRole IdentityRole { get; set; }
    }
}
