using FStudent.Data;
using FStudent.Models.ViewModels;
using FStudent.Tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = WC.AdminRole)]
    public class TaiKhoanApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public TaiKhoanApiController(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("getadmins")]
        public IActionResult GetAdmins(int pageIndex, int pageSize, string filter)
        {
            IEnumerable<IdentityUser> listResult = (from user in _context.Users
                                              join roleuser in _context.UserRoles on user.Id equals roleuser.UserId
                                              join role in _context.Roles on roleuser.RoleId equals role.Id
                                              where role.Name == WC.AdminRole
                                              orderby user.UserName
                                              select user);
            if (!string.IsNullOrEmpty(filter))
            {
                listResult = listResult.Where(u => u.UserName.Contains(Standard.Build(filter)));
            }
            var finalResult = new ResultVM<SplitPage<IdentityUser>, string>()
            {
                Data = SplitPage<IdentityUser>.Split(listResult, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getusers")]
        public IActionResult GetUsers(int pageIndex, int pageSize, string filter)
        {
            IEnumerable<IdentityUser> listResult = (from user in _context.Users
                                                    join roleuser in _context.UserRoles on user.Id equals roleuser.UserId
                                                    join role in _context.Roles on roleuser.RoleId equals role.Id
                                                    where role.Name == WC.UserRole
                                                    orderby user.UserName
                                                    select user);
            if (!string.IsNullOrEmpty(filter))
            {
                listResult = listResult.Where(u => u.UserName.Contains(Standard.Build(filter)));
            }
            
            var finalResult = new ResultVM<SplitPage<IdentityUser>, string>()
            {
                Data = SplitPage<IdentityUser>.Split(listResult, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpPost("resetpw")]
        public async Task<IActionResult> ResetPassword(ResetPasswordVM postData)
        { 
            var user = await _userManager.FindByIdAsync(postData.UserId);

            if (user == null)
            {
                return new JsonResult(new { Message = "Xảy ra lỗi khi tải dữ liệu tài khoản." });
            }

            var removePasswordResult = await _userManager.RemovePasswordAsync(user);
            var addPasswordResult = await _userManager.AddPasswordAsync(user, postData.NewPassword);
            if (!addPasswordResult.Succeeded)
            {
                return new JsonResult(new { Message = $"Xảy ra lỗi khi đổi mật khẩu tài khoản '{user.UserName}'." });
            }

            return new JsonResult(new { Message = $"Đổi mật khẩu tài khoản '{user.UserName}' thành công." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Regist(AccountRegister postData)
        {
            var user = new IdentityUser { UserName = postData.UserName };
            var result = await _userManager.CreateAsync(user, postData.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, WC.AdminRole);
                return new JsonResult(new { Message = $"Tạo tài khoản '{user.UserName}' thành công." });
            }
            else
            {
                return new JsonResult(new { Message = $"Xảy ra lỗi khi tạo tài khoản." });
            }
        }
    }
}
