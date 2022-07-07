using FStudent.Data;
using FStudent.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FStudent.Controllers
{
    [Authorize(Roles = WC.AdminRole)]
    public class RoleController : Controller
    {
        private readonly AppDbContext _db;

        //Constructor
        public RoleController(AppDbContext db)
        {
            _db = db;
        }
        //Routing
        public IActionResult Index()
        {
            RoleVM roleVM = new RoleVM()
            {
                IdentityRoles = _db.Roles,
            };

            return View(roleVM);
        }

        //POST - Create
        /*[HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(RoleVM roleVM)
        {
            try
            {
                IdentityRole identityRole = roleVM.IdentityRole;
                _db.Roles.Add(identityRole);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                return Ok(ex.ToString());
            }
            

            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(RoleVM roleVM)
        {
            if (ModelState.IsValid)
            {
                IdentityRole identityRole = roleVM.IdentityRole;
                _db.Roles.Update(identityRole);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(RoleVM roleVM)
        {
            var id = roleVM.IdentityRole.Id;
            var obj = _db.Roles.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.Roles.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }*/
    }
}
