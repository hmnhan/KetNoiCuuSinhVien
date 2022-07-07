using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class ProfileSecurity
    {
        [Key]
        public string ProfileId { get; set; }
        public bool IsValidate { get; set; }
        public int AccessProfile { get; set; }
        //public int AccessLearningInfor { get; set; }
        public int AccessDateOfBirth { get; set; }
        public int AccessPhoneNumber { get; set; }
        public int AccessEmail { get; set; }
        public int AccessSkype { get; set; }
        public int AccessZalo { get; set; }
        public int AccessFacebook { get; set; }
        public int AccessLinkedIn { get; set; }

        [ForeignKey("ProfileId")]
        public virtual Profile Profile { get; set; }
    }
}
