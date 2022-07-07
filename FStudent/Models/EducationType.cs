using System;
using System.ComponentModel.DataAnnotations;

namespace FStudent.Models
{
    public class EducationType
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Loại hình đào tạo")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Mô tả")]
        public string ShortDesc { get; set; }
    }
}
