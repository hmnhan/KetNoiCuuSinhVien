using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using FStudent.Services;
using FStudent.Tools;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = WC.AdminRole)]
    public class LopSinhHoatApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILopSinhHoat _service;

        public LopSinhHoatApiController(AppDbContext context, ILopSinhHoat service)
        {
            _context = context;
            _service = service;
        }

        #region GET METHODS
        [HttpGet("getall")]
        public IActionResult GetAll(int pageIndex, int pageSize, Guid? specializationId, Guid? acaYearId, string filter)
        {
            ActivityClassFilter acFilter = new ActivityClassFilter()
            {
                SpecializationId = specializationId,
                AcaYearId = acaYearId,
                Filter = filter
            };
            var listResult = _service.GetAll(_context, acFilter);

            var finalResult = new ResultVM<SplitPage<ActivityClass>, ActivityClassFilter>()
            {
                Data = SplitPage<ActivityClass>.Split(listResult, pageIndex, pageSize),
                Filter = acFilter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getbyid")]
        public IActionResult GetById(Guid id)
        {
            ActivityClass obj = _context.ActivityClass.Include(u => u.AcademicYear).Include(u => u.Specialization).FirstOrDefault(u => u.Id.Equals(id));

            if (obj == null)
            {
                return BadRequest($"Lớp sinh hoạt với id {id} không tồn tại.");
            }

            return new JsonResult(obj);
        }

        #endregion

        #region POST METHODS
        [HttpPost("createac")]
        public IActionResult Create(ActivityClassPostData postData)
        {
            ActivityClassVM acVM = _service.Create(_context, postData.AcademicYearId, postData.Data);
            return new JsonResult(acVM);
        }
        #endregion

        #region PUT METHODS
        [HttpPut("updateac")]
        public IActionResult Edit(ActivityClassPutData putData)
        {
            var objIfExist = _context.ActivityClass.Find(putData.Id);

            if (objIfExist == null)
            {
                return BadRequest("Lớp sinh hoạt cần cập nhật không tồn tại");
            }

            objIfExist.Name = putData.Name;
            objIfExist.AcademicYearId = putData.AcademicYearId;
            objIfExist.SpecializationId = putData.SpecializationId;
            objIfExist.ShortDesc = putData.ShortDesc;

            _context.ActivityClass.Update(objIfExist);
            _context.SaveChanges();
            ActivityClassVM acVM = new ActivityClassVM()
            {
                ActivityClass = objIfExist,
                Message = $"Cập nhật lớp sinh hoạt {objIfExist.Name} thành công"
            };
            return new JsonResult(acVM);
        }
        #endregion

        #region DELETE METHODS
        [HttpDelete("deleteac")]
        public IActionResult Delete(Guid id)
        {
            var objIfExist = _context.ActivityClass.Find(id);

            if (objIfExist == null)
            {
                return BadRequest("Lớp sinh hoạt cần xóa không tồn tại");
            }
            _context.ActivityClass.Remove(objIfExist);
            _context.SaveChanges();
            ActivityClassVM acVM = new ActivityClassVM()
            {
                ActivityClass = objIfExist,
                Message = $"Xóa Lớp sinh hoạt {objIfExist.Name} thành công"
            };
            return new JsonResult(acVM);
        }
        #endregion
    }
}
