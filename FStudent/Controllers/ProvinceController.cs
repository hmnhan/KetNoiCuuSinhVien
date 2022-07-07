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
    public class ProvinceController : Controller
    {
        private readonly AppDbContext _db;

        public ProvinceController(AppDbContext db)
        {
            _db = db;
        }
        //Routing
        public IActionResult Index()
        {
            ProvinceVM provinceVM = new ProvinceVM()
            {
                Provinces = _db.Province.OrderBy(u => u.Name)
            };

            return View(provinceVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Province province)
        {
            if (ModelState.IsValid)
            {
                _db.Province.Add(province);
                _db.SaveChanges();

            }
            return RedirectToAction("Index");
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Province province)
        {
            if (ModelState.IsValid)
            {
                _db.Province.Update(province);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(Province province)
        {
            var id = province.Id;
            var obj = _db.Province.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.Province.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("Index");
        }

        //City
        public IActionResult IndexCity()
        {
            DistrictVM districtVM = new DistrictVM()
            {
                Districts = _db.District.Include(u => u.Province).OrderBy(u => u.Province.Name).ThenBy(u => u.Name),
                ProvinceSelectList = _db.Province.OrderBy(u => u.Name).Select(i => new SelectListItem
                {
                    Text = i.Name,
                    Value = i.Id.ToString()
                })
            };

            return View(districtVM);
        }

        public IActionResult IndexCityWithId(int id)
        {
            DistrictVM districtVM = new DistrictVM()
            {
                Districts = _db.District.Include(u => u.Province).Where(u => u.Id == id).OrderBy(u => u.Province.Name).ThenBy(u => u.Name),
                Province = _db.Province.Find(id)
            };

            return View("IndexCity", districtVM);
        }

        //POST - Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CreateDistrict(District district)
        {
            if (ModelState.IsValid)
            {
                _db.District.Add(district);
                _db.SaveChanges();

            }
 
            return RedirectToAction("IndexCityWithId", new { id = district.ProvinceId });
        }

        //POST - Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EditDistrict(District district)
        {
            if (ModelState.IsValid)
            {
                _db.District.Update(district);
                _db.SaveChanges();
            }
            return RedirectToAction("IndexCityWithId", new { id = district.ProvinceId });
        }

        //POST - Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteDistrict(District district)
        {
            var id = district.Id;
            var obj = _db.District.Find(id);
            if (obj == null)
            {
                return NotFound();
            }
            _db.District.Remove(obj);
            _db.SaveChanges();
            return RedirectToAction("IndexCityWithId", new { id = district.ProvinceId });
        }
    }
}
