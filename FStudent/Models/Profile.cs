using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models
{
    public class Profile
    {

        [Key]
        public string Id { get; set; }
        public string Avatar { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Họ tên")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Tên thường gọi")]
        public string NickName { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [DataType(DataType.Date)]
        [Display(Name = "Ngày sinh")]
        public DateTime? DateOfBirth { get; set; }
        [Required(ErrorMessage = "Trường này không được trống")]
        [Display(Name = "Giới tính")]
        public int GenderId { get; set; }
        [Display(Name = "Thông tin thêm")]
        public string About { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateUpdated { get; set; }
        [Phone]
        [Display(Name = "Số điện thoại")]
        public string PhoneNumber { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Skype { get; set; }
        public string Zalo { get; set; }
        public string Facebook { get; set; }
        public string LinkedIn { get; set; }

        [ForeignKey("Id")]
        public virtual IdentityUser IdentityUser { get; set; }
        [ForeignKey("GenderId")]
        public virtual Gender Gender { get; set; }
    }
}
