using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FStudent.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _db;

        public HomeController(ILogger<HomeController> logger, AppDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        public IActionResult Index()
        {
            if (User.IsInRole(WC.AdminRole))
            {
                return RedirectToAction("Index", "HomeAdmin");
            }
            
            return View();
        }

        public IActionResult Profile()
        {    
            return View();
        }

        public IActionResult Password()
        {
            return View();
        }

        public IActionResult Search()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var objSecurity = _db.ProfileSecurity.Find(userId);
            if (objSecurity == null)
            {
                return RedirectToAction("AccessDenied");
            }
            else if (objSecurity.IsValidate == false)
            {
                return RedirectToAction("AccessDenied");
            }
            return View();
        }

        public IActionResult AccessDenied()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
