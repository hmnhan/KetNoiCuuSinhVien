using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class LearningInfor
    {
        [Key]
        public string ProfileId { get; set; }
        [Display(Name = "Lớp sinh hoạt")]
        public Guid? ActivityClassId { get; set; }

        [ForeignKey("ProfileId")]
        public virtual Profile Profile { get; set; }
        [ForeignKey("ActivityClassId")]
        public virtual ActivityClass ActivityClass { get; set; }
    }
}
