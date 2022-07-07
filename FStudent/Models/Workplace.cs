using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudent.Models
{
    public class Workplace
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Nơi làm việc")]
        public string Name { get; set; }
        [Display(Name = "Quận/Huyện")]
        public int DistricId { get; set; }
        [Display(Name = "Mô tả")]
        public string ShortDesc { get; set; }
        [ForeignKey("DistrictId")]
        public virtual District District { get; set; }
    }
}
