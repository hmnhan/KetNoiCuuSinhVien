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
    public class NienKhoaApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INienKhoa _service;

        public NienKhoaApiController(AppDbContext context, INienKhoa service)
        {
            _context = context;
            _service = service;
        }

        #region GET METHODS
        [HttpGet("getall")]
        public IActionResult GetAll(int pageIndex, int pageSize, int? startYear, int? endYear, Guid? eduTypeId, string filter)
        {
            AcademicYearFilter ayFilter = new AcademicYearFilter()
            {
                StartYear = startYear,
                EndYear = endYear,
                EduTypeId = eduTypeId,
                Filter = filter
            };
            var listResult = _service.GetAll(_context, ayFilter);

            var finalResult = new ResultVM<SplitPage<AcademicYear>, AcademicYearFilter>()
            {
                Data = SplitPage<AcademicYear>.Split(listResult, pageIndex, pageSize),
                Filter = ayFilter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getbyid")]
        public IActionResult GetById(Guid id)
        {
            AcademicYear obj = _context.AcademicYear.Include(u => u.EducationType).FirstOrDefault(u => u.Id.Equals(id));

            if (obj == null)
            {
                return BadRequest($"Niên khóa với id {id} không tồn tại.");
            }

            return new JsonResult(obj);
        }

        #endregion

        #region POST METHODS
        [HttpPost("createay")]
        public IActionResult Create(AcademicYearPostData postData)
        {
            AcademicYearVM ayVM = _service.Create(_context, postData.Id, postData.data);
            return new JsonResult(ayVM);
        }
        #endregion

        #region PUT METHODS
        [HttpPut("updateay")]
        public IActionResult Edit(AcademicYearPutData putData)
        {
            var objIfExist = _context.AcademicYear.Find(putData.Id);

            if (objIfExist == null)
            {
                return BadRequest("Niên khóa cần cập nhật không tồn tại");
            }

            objIfExist.Name = putData.Name;
            objIfExist.Academic = putData.Academic;
            objIfExist.EducationTypeId = putData.EducationTypeId;
            objIfExist.ShortDesc = putData.Description;
            objIfExist.StartYear = putData.StartYear;
            objIfExist.EndYear = putData.EndYear;

            _context.AcademicYear.Update(objIfExist);
            _context.SaveChanges();
            AcademicYearVM ayVM = new AcademicYearVM()
            {
                AcademicYear = objIfExist,
                Message = $"Cập nhật niên khóa {objIfExist.Name} thành công"
            };
            return new JsonResult(ayVM);
        }
        #endregion

        #region DELETE METHODS
        [HttpDelete("deleteay")]
        public IActionResult Delete(Guid id)
        {
            var objIfExist = _context.AcademicYear.Find(id);

            if (objIfExist == null)
            {
                return BadRequest("Chuyên ngành cần xóa không tồn tại");
            }
            _context.AcademicYear.Remove(objIfExist);
            _context.SaveChanges();
            AcademicYearVM ayVM = new AcademicYearVM()
            {
                AcademicYear = objIfExist,
                Message = $"Xóa niên khóa {objIfExist.Name} thành công"
            };
            return new JsonResult(ayVM);
        }
        #endregion
    }
}
