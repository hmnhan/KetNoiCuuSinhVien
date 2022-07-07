using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using FStudent.Services;
using FStudent.Tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = WC.AdminRole)]
    public class ChuyenNganhApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IChuyenNganh _service;

        public ChuyenNganhApiController(AppDbContext context, IChuyenNganh service)
        {
            _context = context;
            _service = service;
        }

        #region GET METHODS
        [HttpGet("getall")]
        public IActionResult GetAll(int pageIndex, int pageSize, string filter)
        {
            var listResult = _service.GetAll(_context, filter);
            
            var finalResult = new ResultVM<SplitPage<Specialization>, string>()
            {
                Data = SplitPage<Specialization>.Split(listResult, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getbyid")]
        public IActionResult GetById(Guid id)
        {
            Specialization spc = _context.Specialization.Find(id);

            if (spc == null)
            {
                return BadRequest($"Chuyên ngành với id {id} không tồn tại.");
            }
            
            return new JsonResult(spc);
        }
        #endregion

        #region POST METHODS
        [HttpPost("createspc")]
        public IActionResult Create(List<SpecializationPost> specializations)
        {
            SpecializationVM spcVM = _service.Create(_context, specializations);
            return new JsonResult(spcVM);
        }
        #endregion

        #region PUT METHODS
        [HttpPut("updatespc")]
        public IActionResult Edit(Specialization specialization)
        {
            var objIfExist = _context.Specialization.Any(u => u.Id.Equals(specialization.Id));

            if (objIfExist == false)
            {
                return BadRequest("Chuyên ngành cần cập nhật không tồn tại");
            }
            _context.Specialization.Update(specialization);
            _context.SaveChanges();
            SpecializationVM spcVM = new SpecializationVM()
            {
                Specialization = specialization,
                Message = $"Cập nhật chuyên ngành {specialization.Name} thành công"
            };
            return new JsonResult(spcVM);
        }
        #endregion

        #region DELETE METHODS
        [HttpDelete("deletespc")]
        public IActionResult Delete(Guid id)
        {
            var objIfExist = _context.Specialization.Find(id);

            if (objIfExist == null)
            {
                return BadRequest("Chuyên ngành cần xóa không tồn tại");
            }
            _context.Specialization.Remove(objIfExist);
            _context.SaveChanges();
            SpecializationVM spcVM = new SpecializationVM()
            {
                Specialization = objIfExist,
                Message = $"Xóa chuyên ngành {objIfExist.Name} thành công"
            };
            return new JsonResult(spcVM);
        }
        #endregion
    }
}
