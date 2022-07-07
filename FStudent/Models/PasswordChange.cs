using System.ComponentModel.DataAnnotations;

namespace FStudent.Models
{
    public class PasswordChange
    {
        [Required(ErrorMessage = "Mật khẩu mới đang trống")]
        [StringLength(100, ErrorMessage = "{0} phải dài từ {2} cho đến {1} ký tự.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu mới")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("NewPassword", ErrorMessage = "Hai mật khẩu không khớp nhau, vui lòng kiểm tra lại.")]
        public string ConfirmPassword { get; set; }
    }
}
