using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace FStudent.Views.AcademicYear
{
    [Authorize(Roles = WC.AdminRole)]
    public class AcademicYearController : Controller
    {
        private readonly AppDbContext _db;
        //Constructor
        public AcademicYearController(AppDbContext db)
        {
            _db = db;
        }

        //Routing
        public IActionResult Index()
        {
            
            AcademicYearVM academicYearVM = new AcademicYearVM()
            {
                AcademicYears = _db.AcademicYear.Include(u => u.EducationType).OrderBy(u => u.Academic).ThenBy(u => u.EducationTypeId),
                EducationTypeSelectList = _db.EducationType.Select(i => new SelectListItem
                {
                    Text = i.Name,
                    Value = i.Id.ToString()
                })

            };

            return View(academicYearVM);
        }
        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(AcademicYearVM academicYearVM)
        {
            var obj = academicYearVM.AcademicYear;
            if (ModelState.IsValid)
            {
                _db.AcademicYear.Add(obj);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(AcademicYearVM academicYearVM)
        {
            var obj = academicYearVM.AcademicYear;
            if (ModelState.IsValid)
            {
                _db.AcademicYear.Update(obj);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(AcademicYearVM academicYearVM)
        {
            var id = academicYearVM.AcademicYear.Id;
            var obj = _db.AcademicYear.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.AcademicYear.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

    }
}
