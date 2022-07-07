using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class Address
    {
        [Key]

        public string ProfileId { get; set; }

        [Display(Name = "Quận/Huyện")]
        public int DistrictId { get; set; }

        [Display(Name = "Loại địa chỉ")]
        public int AddressTypeId { get; set; }
        [Display(Name = "Mô tả")]
        public string Description { get; set; }

        [ForeignKey("ProfileId")]
        public virtual Profile Profile { get; set; }

        [ForeignKey("DistrictId")]
        public virtual District District { get; set; }

        [ForeignKey("AddressTypeId")]
        public virtual AddressType AddressType { get; set; }
    }
}
