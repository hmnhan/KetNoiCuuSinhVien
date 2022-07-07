using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class District
    {
        [Key]
        public int Id { get; set; }
        [Display(Name = "Tỉnh/Thành phố")]
        public int ProvinceId { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Quận/Huyện")]
        public string Name { get; set; }
        [Display(Name = "Mô tả")]
        public string Description { get; set; }
        [ForeignKey("ProvinceId")]
        public virtual Province Province { get; set; }
    }
}
