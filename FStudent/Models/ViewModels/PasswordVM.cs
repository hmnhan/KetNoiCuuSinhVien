using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models.ViewModels
{
    public class PasswordVM
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ResetPasswordVM
    {
        public string UserId { get; set; }
        public string NewPassword { get; set; }
    }
}
