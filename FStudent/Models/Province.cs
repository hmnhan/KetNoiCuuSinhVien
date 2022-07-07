using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class Province
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Tỉnh")]
        public string Name { get; set; }
    }
}
