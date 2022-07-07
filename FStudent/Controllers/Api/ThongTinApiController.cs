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
    public class ThongTinApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IProfile _service;

        public ThongTinApiController(AppDbContext context, IProfile service)
        {
            _context = context;
            _service = service;
        }

        [HttpGet("getall")]
        public IActionResult GetAll(int pageIndex, int pageSize, Guid? eduTypeId, Guid? spcId, Guid? acaYearId, Guid? actClassId)
        {
            ProfileFilter filter = new ProfileFilter()
            {
                EduTypeId = eduTypeId,
                SpcId = spcId,
                AcaYearId = acaYearId,
                ActClassId = actClassId
            };

            var data = _service.GetProfiles(_context, filter);

            var finalResult = new ResultVM<SplitPage<Profile>, ProfileFilter>()
            {
                Data = SplitPage<Profile>.Split(data, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getdetail")]
        public IActionResult GetDetail(string id)
        {
            var data = _context.Profile.Join(_context.LearningInfor, pf => pf.Id, li => li.ProfileId, (pf, li) => new { profile = pf, learningInfor = li })
                .Join(_context.ActivityClass, li => li.learningInfor.ActivityClassId, ac => ac.Id, (li, ac) => new { profile = li.profile, activityClass = ac })
                .Join(_context.Specialization, li => li.activityClass.SpecializationId, spc => spc.Id, (li, spc) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = spc })
                .Join(_context.AcademicYear, li => li.activityClass.AcademicYearId, ay => ay.Id, (li, ay) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = ay })
                .Join(_context.EducationType, li => li.academicYear.EducationTypeId, et => et.Id, (li, et) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = et })
                .Join(_context.Gender, li => li.profile.GenderId, gd => gd.Id, (li, gd) => new { profile = li.profile, gender = gd, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = li.educationType })
                .FirstOrDefault(u => u.profile.Id.Equals(id));

            return new JsonResult(data);
        }

        [HttpGet("getdetailwk")]
        public IActionResult GetDetailWorkingInfo(string id)
        {
            var data = _context.WorkingInfor.Where(u => u.ProfileId.Equals(id)).ToList();

            return new JsonResult(data);
        }

        [HttpGet("getspc")]
        public IActionResult GetSpecialization()
        {
            var data = _service.GetSpecialization(_context);
            return new JsonResult(data);
        }

        [HttpGet("getet")]
        public IActionResult GetEducationType()
        {
            var data = _service.GetEducationType(_context);
            return new JsonResult(data);
        }

        [HttpGet("getay")]
        public IActionResult GetAcademicYear(Guid? eduTypeId)
        {
            var data = _service.GetAcademicYear(_context, eduTypeId);
            return new JsonResult(data);
        }

        [HttpGet("getac")]
        public IActionResult GetActivityClass(Guid? acaYearId, Guid? spcId)
        {
            var data = _service.GetActivityClass(_context, acaYearId, spcId);
            return new JsonResult(data);
        }
    }
}
