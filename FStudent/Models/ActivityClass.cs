using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class ActivityClass
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Lớp sinh hoạt")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Niên khóa")]
        public Guid? AcademicYearId { get; set; }
        [Required(ErrorMessage = "Trường này không được trống.")]
        [Display(Name = "Chuyên ngành")]
        public Guid? SpecializationId { get; set; }
        [Display(Name = "Mô tả")]
        public string ShortDesc { get; set; }

        [ForeignKey("AcademicYearId")]
        public virtual AcademicYear AcademicYear { get; set; }
        [ForeignKey("SpecializationId")]
        public virtual Specialization Specialization { get; set; }
    }
}
