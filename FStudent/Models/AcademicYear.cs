using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class AcademicYear
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Niên khóa")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Khóa")]
        [Range(1, int.MaxValue, ErrorMessage = "Khóa phải lớn hơn 0.")]
        public int Academic { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Loại hình đào tạo")]
        public Guid? EducationTypeId { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Năm bắt đầu")]
        [Range(1, int.MaxValue, ErrorMessage = "Năm bắt đầu phải lớn hơn 0.")]
        public int StartYear { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Năm kết thúc")]
        [Range(0, int.MaxValue, ErrorMessage = "Năm kết thúc phải bằng hoặc lớn hơn 0.")]
        public int EndYear { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Mô tả")]
        public string ShortDesc { get; set; }

        [ForeignKey("EducationTypeId")]
        public virtual EducationType EducationType { get; set; }
    }
}
