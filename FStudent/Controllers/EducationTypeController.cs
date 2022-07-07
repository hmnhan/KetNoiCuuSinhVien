using FStudent.Data;
using FStudent.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using FStudent.Models.ViewModels;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class EducationTypeController : Controller
    {
        private readonly AppDbContext _db;

        //Constructor
        public EducationTypeController(AppDbContext db)
        {
            _db = db;
        }

        //Routing
        public IActionResult Index()
        {
            EducationTypeVM educationTypeVM = new EducationTypeVM()
            {
                EducationTypes = _db.EducationType,
            };

            return View(educationTypeVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(EducationType educationType)
        {
            if (ModelState.IsValid)
            {
                _db.EducationType.Add(educationType);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(EducationType educationType)
        {
            if (ModelState.IsValid)
            {
                _db.EducationType.Update(educationType);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(EducationType educationType)
        {
            var id = educationType.Id;
            var obj = _db.EducationType.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.EducationType.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
