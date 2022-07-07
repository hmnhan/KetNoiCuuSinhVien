using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class SpecializationController : Controller
    {
        private readonly AppDbContext _db;

        public SpecializationController(AppDbContext db)
        {
            _db = db;
        }

        //Routing
        public IActionResult Index()
        {
            SpecializationVM specializationVM = new SpecializationVM()
            {
                Specializations = _db.Specialization
            };

            return View(specializationVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Specialization specialization)
        {
            if (ModelState.IsValid)
            {
                _db.Specialization.Add(specialization);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Specialization specialization)
        {
            if (ModelState.IsValid)
            {
                _db.Specialization.Update(specialization);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(Specialization specialization)
        {
            var id = specialization.Id;
            var obj = _db.Specialization.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.Specialization.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
