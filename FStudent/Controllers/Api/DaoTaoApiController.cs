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
    public class DaoTaoApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILoaiHinhDaoTao _service;

        public DaoTaoApiController(AppDbContext context, ILoaiHinhDaoTao service)
        {
            _context = context;
            _service = service;
        }

        #region GET METHODS
        [HttpGet("getall")]
        public IActionResult GetAll(int pageIndex, int pageSize, string filter)
        {
            var listResult = _service.GetAll(_context, filter);

            var finalResult = new ResultVM<SplitPage<EducationType>, string>()
            {
                Data = SplitPage<EducationType>.Split(listResult, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getbyid")]
        public IActionResult GetById(Guid id)
        {
            EducationType obj = _context.EducationType.Find(id);

            if (obj == null)
            {
                return BadRequest($"Loại hình đào tạo với id {id} không tồn tại.");
            }

            return new JsonResult(obj);
        }
        #endregion

        #region POST METHODS
        [HttpPost("createet")]
        public IActionResult Create(List<EducationTypePost> data)
        {
            EducationTypeVM etVM = _service.Create(_context, data);
            return new JsonResult(etVM);
        }
        #endregion

        #region PUT METHODS
        [HttpPut("updateet")]
        public IActionResult Edit(EducationType educationType)
        {
            var objIfExist = _context.EducationType.Any(u => u.Id.Equals(educationType.Id));

            if (objIfExist == false)
            {
                return BadRequest("Loại hình đào tạo cần cập nhật không tồn tại");
            }
            _context.EducationType.Update(educationType);
            _context.SaveChanges();
            EducationTypeVM etVM = new EducationTypeVM()
            {
                EducationType = educationType,
                Message = $"Cập nhật loại hình đào tạo {educationType.Name} thành công"
            };
            return new JsonResult(etVM);
        }
        #endregion

        #region DELETE METHODS
        [HttpDelete("deleteet")]
        public IActionResult Delete(Guid id)
        {
            var objIfExist = _context.EducationType.Find(id);

            if (objIfExist == null)
            {
                return BadRequest("Loại hình đào tạo cần xóa không tồn tại");
            }
            _context.EducationType.Remove(objIfExist);
            _context.SaveChanges();
            EducationTypeVM etVM = new EducationTypeVM()
            {
                EducationType = objIfExist,
                Message = $"Xóa loại hình đào tạo {objIfExist.Name} thành công"
            };
            return new JsonResult(etVM);
        }
        #endregion
    }
}
