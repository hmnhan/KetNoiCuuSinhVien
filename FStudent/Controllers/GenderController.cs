using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class GenderController : Controller
    {
        private readonly AppDbContext _db;
        public GenderController(AppDbContext db)
        {
            _db = db;
        }
        //Routing
        public IActionResult Index()
        {
            GenderVM genderVM = new GenderVM()
            {
                Genders = _db.Gender,
            };

            return View(genderVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Gender gender)
        {
            if (ModelState.IsValid)
            {
                _db.Gender.Add(gender);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Gender gender)
        {
            if (ModelState.IsValid)
            {
                _db.Gender.Update(gender);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(Gender gender)
        {
            var id = gender.Id;
            var obj = _db.Gender.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.Gender.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
