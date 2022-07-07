using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class AccountVM
    {
        public IEnumerable<IdentityUser> IdentityUsers { get; set; }
        public IdentityUser IdentityUser { get; set; }
        public PasswordChange PasswordChange { get; set; }
        public string Switch { get; set; }
        public string StatusMessage { get; set; }
    }

    public class AccountRegister
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
