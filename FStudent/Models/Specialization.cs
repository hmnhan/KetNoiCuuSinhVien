using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class Specialization
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Tên chuyên ngành không được trống")]
        [Column(TypeName = "nvarchar(100)")]
        [Display(Name = "Tên")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        [Display(Name = "Mô tả")]
        public string Description { get; set; }
    }
}
