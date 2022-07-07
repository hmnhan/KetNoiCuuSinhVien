using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class Gender
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Mô tả")]
        public string ShortDesc { get; set; }
    }
}
