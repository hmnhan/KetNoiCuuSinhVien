using FStudent.Data;
using FStudent.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FStudent.Controllers
{
    [Route("api/home")]
    public class ApiController : Controller
    {
        private readonly AppDbContext _db;
        public ApiController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("renderavtprofile")]
        public IActionResult GetAvatar()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Profile prf = _db.Profile.Find(userId);

            return new JsonResult(prf);
        }
    }
}
