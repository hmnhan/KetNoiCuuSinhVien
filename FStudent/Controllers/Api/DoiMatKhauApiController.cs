using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FStudent.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = WC.UserRole)]
    public class DoiMatKhauApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public DoiMatKhauApiController(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(PasswordVM passwordVM)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new JsonResult(new { Message = "Không thể tải thông tin tài khoản." });
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, passwordVM.OldPassword, passwordVM.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                return new JsonResult(new { Message = "Thay đổi mật khẩu không thành công. Vui lòng kiểm tra lại." });
            }

            return new JsonResult(new { Message = "Thay đổi mật khẩu thành công." });
        }
    }
}
