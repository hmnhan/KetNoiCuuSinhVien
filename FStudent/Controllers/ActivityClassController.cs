using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class ActivityClassController : Controller
    {
        private readonly AppDbContext _db;
        //Constructor
        public ActivityClassController(AppDbContext db)
        {
            _db = db;
        }

        //Routing
        public IActionResult Index()
        {

            ActivityClassVM activityClassVM = new ActivityClassVM()
            {
                ActivityClasses = _db.ActivityClass.Include(u => u.AcademicYear).Include(u => u.Specialization).OrderBy(u => u.SpecializationId).ThenBy(u => u.AcademicYear),
                AcademicYearSelectList = _db.AcademicYear.OrderBy(u => u.EducationTypeId).ThenBy(u => u.Academic).Select(u => new SelectListItem
                {
                    Text = u.Name,
                    Value = u.Id.ToString()
                }),
                SpecializationSelectList = _db.Specialization.OrderBy(u => u.Name).Select(i => new SelectListItem
                {
                    Text = i.Name,
                    Value = i.Id.ToString()
                })

            };

            return View(activityClassVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(ActivityClass activityClass)
        {
            if (ModelState.IsValid)
            {
                _db.ActivityClass.Add(activityClass);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(ActivityClass activityClass)
        {
            if (ModelState.IsValid)
            {
                _db.ActivityClass.Update(activityClass);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
