using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class AddressType
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        public string Description { get; set; }
    }
}
