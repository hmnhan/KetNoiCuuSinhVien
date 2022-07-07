using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _db;

        public AccountController(UserManager<IdentityUser> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        /*public IActionResult IndexManager(string statusMessage)
        {
            AccountVM accountVM = new AccountVM()
            {
                IdentityUsers = (from user in _db.Users
                                 join roleuser in _db.UserRoles on user.Id equals roleuser.UserId
                                 join role in _db.Roles on roleuser.RoleId equals role.Id
                                 where role.Name == WC.AdminRole
                                 orderby user.UserName
                                 select user),
                Switch = WC.AdminRole,
                StatusMessage = statusMessage
            };
            return View("Index", accountVM);
        }

        public IActionResult IndexUser(string statusMessage)
        {
            AccountVM accountVM = new AccountVM()
            {
                IdentityUsers = (from user in _db.Users
                                 join roleuser in _db.UserRoles on user.Id equals roleuser.UserId
                                 join role in _db.Roles on roleuser.RoleId equals role.Id
                                 where role.Name == WC.UserRole
                                 orderby user.UserName
                                 select user),
                Switch = WC.UserRole,
                StatusMessage = statusMessage
            };
            return View("Index", accountVM);
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(AccountVM accountVM)
        {
            string action = "";
            if (accountVM.Switch.Equals(WC.AdminRole))
            {
                action = "IndexManager";
            }
            if (accountVM.Switch.Equals(WC.UserRole))
            {
                action = "IndexUser";
            }
            if (!ModelState.IsValid)
            {
                return RedirectToAction(action, new { statusMessage = "Thông tin thay đổi không chính xác." });
            }

            var user = await _userManager.FindByIdAsync(accountVM.IdentityUser.Id);

            if (user == null)
            {
                return NotFound($"Không thể tải lên dữ liệu tài khoản '{accountVM.IdentityUser.UserName}'.");
            }

            PasswordChange password = accountVM.PasswordChange;

            var removePasswordResult = await _userManager.RemovePasswordAsync(user);
            var addPasswordResult = await _userManager.AddPasswordAsync(user, password.NewPassword);
            if (!addPasswordResult.Succeeded)
            {
                return RedirectToAction(action, new { statusMessage = $"Xảy ra lỗi khi đổi mật khẩu tài khoản'{accountVM.IdentityUser.UserName}'." });
            }

            return RedirectToAction(action, new { statusMessage = $"Đổi mật khẩu tài khoản '{accountVM.IdentityUser.UserName}' thành công." });
        }
        [HttpPost]
        public async Task<IActionResult> Delete(AccountVM accountVM)
        {
            string action = "";
            if (accountVM.Switch.Equals(WC.AdminRole))
            {
                action = "IndexManager";
            }
            if (accountVM.Switch.Equals(WC.UserRole))
            {
                action = "IndexUser";
            }
            if (!ModelState.IsValid)
            {
                return RedirectToAction(action, new { statusMessage = "Xảy ra lỗi khi thực hiện xóa tài khoản." });
            }
            var user = await _userManager.FindByIdAsync(accountVM.IdentityUser.Id);
            if (user == null)
            {
                return RedirectToAction(action, new { statusMessage = $"Không thể tải lên dữ liệu tài khoản '{accountVM.IdentityUser.UserName}'." });
            }
            if (user.UserName.Equals(WC.DefaultAccount))
            {
                return RedirectToAction(action, new { statusMessage = $"Tài khoản'{accountVM.IdentityUser.UserName}' không được phép xóa." });
            }
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return RedirectToAction(action, new { statusMessage = $"Xảy ra lỗi khi xóa tài khoản'{accountVM.IdentityUser.UserName}'." });
            }

            return RedirectToAction(action, new { statusMessage = $"Xóa tài khoản '{accountVM.IdentityUser.UserName}' thành công." });
        }

        public IActionResult DetailUser(string id)
        {
            Profile profile = _db.Profile.Include(u => u.Gender).FirstOrDefault(u => u.Id.Equals(id));
            ProfileVM profileVM;
            if (profile == null)
            {
                profileVM = new ProfileVM()
                {
                    Profile = new Profile(),
                    StatusMessage = "Xảy ra lỗi khi tải thông tin tài khoản."
                };
                return View(profileVM);
            }
            profileVM = new ProfileVM()
            {
                Profile = profile,
                StatusMessage = ""
            };
            return View(profileVM);
        }*/

        public IActionResult AdminDashboard()
        {
            return View();
        }

        public IActionResult UserDashboard()
        {
            return View();
        }
    }
}
