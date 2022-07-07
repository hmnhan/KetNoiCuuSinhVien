using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models.ViewModels
{
    public class ProfileSecurityVM
    {
        public int AccessProfile { get; set; }
        //public int AccessLearningInfor { get; set; }
        public int AccessDateOfBirth { get; set; }
        public int AccessPhoneNumber { get; set; }
        public int AccessEmail { get; set; }
        public int AccessSkype { get; set; }
        public int AccessZalo { get; set; }
        public int AccessFacebook { get; set; }
        public int AccessLinkedIn { get; set; }
    }

}
