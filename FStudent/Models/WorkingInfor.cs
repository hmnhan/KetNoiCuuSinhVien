using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class WorkingInfor
    {
        [Key]
        public Guid Id { get; set; }
        public string ProfileId { get; set; }
        [Required(ErrorMessage = "Tên chuyên ngành không được trống")]
        [Display(Name = "Nơi làm việc")]
        public string Workplace { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Năm bắt đầu")]
        public int StartYear { get; set; }
        [DataType(DataType.Date)]
        [Display(Name = "Năm kết thúc")]
        public int? EndYear { get; set; }

        [ForeignKey("ProfileId")]
        public virtual Profile Profile { get; set; }
    }
}
