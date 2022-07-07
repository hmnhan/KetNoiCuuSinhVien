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
using System.Security.Claims;
using System.Threading.Tasks;

namespace FStudent.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = WC.UserRole)]
    public class CapNhatThongTinApiController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IUpdateProfile _service;
        private readonly IProfile _service2;

        public CapNhatThongTinApiController(AppDbContext context, IUpdateProfile service, IProfile service2)
        {
            _context = context;
            _service = service;
            _service2 = service2;
        }

        [HttpPost("createpf")]
        public IActionResult UpdateProfile(ProfilePostData postData)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var objIfExist = _context.Profile.Find(userId);

                if (objIfExist == null)
                {
                    Profile prf = new Profile()
                    {
                        Id = userId,
                        FullName = postData.Profile.FullName,
                        NickName = postData.Profile.NickName,
                        DateOfBirth = DateTime.Parse(postData.Profile.DateOfBirth),
                        DateUpdated = DateTime.Now,
                        GenderId = postData.Profile.GenderId,
                        PhoneNumber = postData.Profile.PhoneNumber,
                        Email = postData.Profile.Email,
                        Facebook = postData.Profile.Facebook,
                        LinkedIn = postData.Profile.LinkedIn,
                        Skype = postData.Profile.Skype,
                        Zalo = postData.Profile.Zalo,
                        About = postData.Profile.About
                    };
                    _context.Profile.Add(prf);

                    bool isValidate = _service.CheckValidate(_context, prf);
                    var pfIfExist = _context.ProfileSecurity.Find(userId);

                    if (pfIfExist == null)
                    {
                        ProfileSecurity proSrt = new ProfileSecurity()
                        {
                            ProfileId = prf.Id,
                            IsValidate = isValidate,
                            AccessProfile = postData.Security.AccessProfile,
                            AccessDateOfBirth = postData.Security.AccessDateOfBirth,
                            AccessEmail = postData.Security.AccessEmail,
                            AccessFacebook = postData.Security.AccessFacebook,
                            AccessLinkedIn = postData.Security.AccessLinkedIn,
                            AccessPhoneNumber = postData.Security.AccessPhoneNumber,
                            AccessSkype = postData.Security.AccessSkype,
                            AccessZalo = postData.Security.AccessZalo
                        };
                        _context.ProfileSecurity.Add(proSrt);
                    }
                    else
                    {
                        pfIfExist.IsValidate = isValidate;
                        pfIfExist.AccessProfile = postData.Security.AccessProfile;
                        pfIfExist.AccessDateOfBirth = postData.Security.AccessDateOfBirth;
                        pfIfExist.AccessEmail = postData.Security.AccessEmail;
                        pfIfExist.AccessFacebook = postData.Security.AccessFacebook;
                        //pfIfExist.AccessLearningInfor = postData.Security.AccessLearningInfor;
                        pfIfExist.AccessLinkedIn = postData.Security.AccessLinkedIn;
                        pfIfExist.AccessPhoneNumber = postData.Security.AccessPhoneNumber;
                        pfIfExist.AccessSkype = postData.Security.AccessSkype;
                        pfIfExist.AccessZalo = postData.Security.AccessZalo;
                        _context.ProfileSecurity.Update(pfIfExist);
                    }
                }
                else
                {
                    objIfExist.FullName = postData.Profile.FullName;
                    objIfExist.NickName = postData.Profile.NickName;
                    /*objIfExist.Avatar = postData.Profile.Avatar;*/
                    objIfExist.DateOfBirth = DateTime.Parse(postData.Profile.DateOfBirth);
                    objIfExist.DateUpdated = DateTime.Now;
                    objIfExist.GenderId = postData.Profile.GenderId;
                    objIfExist.PhoneNumber = postData.Profile.PhoneNumber;
                    objIfExist.Email = postData.Profile.Email;
                    objIfExist.Facebook = postData.Profile.Facebook;
                    objIfExist.LinkedIn = postData.Profile.LinkedIn;
                    objIfExist.Skype = postData.Profile.Skype;
                    objIfExist.Zalo = postData.Profile.Zalo;
                    objIfExist.About = postData.Profile.About;
                    _context.Profile.Update(objIfExist);

                    var pfSecurity = _context.ProfileSecurity.Find(userId);
                    bool isValidate = _service.CheckValidate(_context, objIfExist);

                    pfSecurity.IsValidate = isValidate;
                    pfSecurity.AccessProfile = postData.Security.AccessProfile;
                    pfSecurity.AccessDateOfBirth = postData.Security.AccessDateOfBirth;
                    pfSecurity.AccessEmail = postData.Security.AccessEmail;
                    pfSecurity.AccessFacebook = postData.Security.AccessFacebook;
                    //pfSecurity.AccessLearningInfor = postData.Security.AccessLearningInfor;
                    pfSecurity.AccessLinkedIn = postData.Security.AccessLinkedIn;
                    pfSecurity.AccessPhoneNumber = postData.Security.AccessPhoneNumber;
                    pfSecurity.AccessSkype = postData.Security.AccessSkype;
                    pfSecurity.AccessZalo = postData.Security.AccessZalo;
                    _context.ProfileSecurity.Update(pfSecurity);
                }
                _context.SaveChanges();

                return new JsonResult(new { Message = "Đã cập nhật thông tin cá nhân thành công." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Message = ex.Message });
            }
        }

        [HttpPost("createli")]
        public IActionResult UpdateLearningInfor(LearningInforPostData postData)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var objIfExist = _context.LearningInfor.Find(userId);

                if (objIfExist == null)
                {
                    LearningInfor prf = new LearningInfor()
                    {
                        ProfileId = userId,
                        ActivityClassId = postData.ActClassId
                    };
                    _context.LearningInfor.Add(prf);
                }
                else
                {
                    objIfExist.ActivityClassId = postData.ActClassId;

                    _context.LearningInfor.Update(objIfExist);
                }

                var privacyIfExist = _context.ProfileSecurity.Find(userId);
                if (privacyIfExist != null)
                {
                    var profile = _context.Profile.Find(userId);

                    privacyIfExist.IsValidate = _service.CheckValidate(_context, profile);
                    _context.ProfileSecurity.Update(privacyIfExist);
                }
                _context.SaveChanges();

                return new JsonResult(new { Message = "Đã cập nhật học vấn thành công." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Message = ex.Message });
            }
        }
        [HttpPost("createwk")]
        public IActionResult CreateWorkingInfor(WorkingInforPostData postData)
        {
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            WorkingInforVM wiVM = _service.CreateWorkingInfor(_context, userId, postData);
            return new JsonResult(wiVM);
            
        }

        [HttpDelete("deletewk")]
        public IActionResult DeleteWorkingInfor(Guid id)
        {
            var objIfExist = _context.WorkingInfor.Find(id);

            if (objIfExist == null)
            {
                return BadRequest("Công việc cần xóa không tồn tại");
            }
            _context.WorkingInfor.Remove(objIfExist);
            _context.SaveChanges();
            WorkingInforVM wiVM = new WorkingInforVM()
            {
                WorkingInfor = objIfExist,
                Message = $"Xóa công việc {objIfExist.Workplace} thành công"
            };
            return new JsonResult(wiVM);
        }

        [HttpGet("search")]
        public IActionResult Search(int pageIndex, int pageSize, string filter, Guid? eduTypeId, Guid? spcId, Guid? acaYearId, Guid? actClassId)
        {
            ProfileFilter prfFilter = new ProfileFilter()
            {
                EduTypeId = eduTypeId,
                SpcId = spcId,
                AcaYearId = acaYearId,
                ActClassId = actClassId
            };
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var data = _service.SearchProfiles(_context, userId, filter, prfFilter);

            var finalResult = new ResultVM<SplitPage<Profile>, string>()
            {
                Data = SplitPage<Profile>.Split(data, pageIndex, pageSize),
                Filter = filter
            };
            return new JsonResult(finalResult);
        }

        [HttpGet("getdetail")]
        public IActionResult GetDetail()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var data = _context.Profile.Join(_context.LearningInfor, pf => pf.Id, li => li.ProfileId, (pf, li) => new { profile = pf, learningInfor = li })
                .Join(_context.ActivityClass, li => li.learningInfor.ActivityClassId, ac => ac.Id, (li, ac) => new { profile = li.profile, activityClass = ac })
                .Join(_context.Specialization, li => li.activityClass.SpecializationId, spc => spc.Id, (li, spc) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = spc })
                .Join(_context.AcademicYear, li => li.activityClass.AcademicYearId, ay => ay.Id, (li, ay) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = ay })
                .Join(_context.EducationType, li => li.academicYear.EducationTypeId, et => et.Id, (li, et) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = et })
                .Join(_context.Gender, li => li.profile.GenderId, gd => gd.Id, (li, gd) => new { profile = li.profile, gender = gd, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = li.educationType })
                .FirstOrDefault(u => u.profile.Id.Equals(userId));

            return new JsonResult(data);
        }

        [HttpGet("getdetailwk")]
        public IActionResult GetDetailWorkingInfo()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var data = _context.WorkingInfor.Where(u => u.ProfileId.Equals(userId)).ToList();

            return new JsonResult(data);
        }

        [HttpGet("getpfscr")]
        public IActionResult GetProfileSecurity()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var data = _context.ProfileSecurity.Find(userId);

            return new JsonResult(data);
        }

        [HttpGet("getgender")]
        public IActionResult GetGender()
        {
            var data = _context.Gender.ToList();

            return new JsonResult(data);
        }

        [HttpGet("getspc")]
        public IActionResult GetSpecialization()
        {
            var data = _service2.GetSpecialization(_context);
            return new JsonResult(data);
        }

        [HttpGet("getet")]
        public IActionResult GetEducationType()
        {
            var data = _service2.GetEducationType(_context);
            return new JsonResult(data);
        }

        [HttpGet("getay")]
        public IActionResult GetAcademicYear(Guid? eduTypeId)
        {
            var data = _service2.GetAcademicYear(_context, eduTypeId);
            return new JsonResult(data);
        }

        [HttpGet("getac")]
        public IActionResult GetActivityClass(Guid? acaYearId, Guid? spcId)
        {
            var data = _service2.GetActivityClass(_context, acaYearId, spcId);
            return new JsonResult(data);
        }

        [HttpGet("getdetailv1")]
        public IActionResult GetDetail(string id)
        {
            var data = _context.Profile.Join(_context.LearningInfor, pf => pf.Id, li => li.ProfileId, (pf, li) => new { profile = pf, learningInfor = li })
                .Join(_context.ActivityClass, li => li.learningInfor.ActivityClassId, ac => ac.Id, (li, ac) => new { profile = li.profile, activityClass = ac })
                .Join(_context.Specialization, li => li.activityClass.SpecializationId, spc => spc.Id, (li, spc) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = spc })
                .Join(_context.AcademicYear, li => li.activityClass.AcademicYearId, ay => ay.Id, (li, ay) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = ay })
                .Join(_context.EducationType, li => li.academicYear.EducationTypeId, et => et.Id, (li, et) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = et })
                .Join(_context.Gender, li => li.profile.GenderId, gd => gd.Id, (li, gd) => new { profile = li.profile, gender = gd, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = li.educationType })
                .FirstOrDefault(u => u.profile.Id.Equals(id));

            string thisUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userCrt = _context.ProfileSecurity.Find(id);
            var classFromUser = _context.LearningInfor.Find(thisUserId).ActivityClassId;
            var classFromDetail = _context.LearningInfor.Find(id).ActivityClassId;
            switch (userCrt.AccessProfile)
            {
                case 1:
                    data.profile.DateOfBirth = null;
                    data.profile.PhoneNumber = "Không hiển thị";
                    data.profile.Email = "Không hiển thị";
                    data.profile.Skype = "Không hiển thị";
                    data.profile.Zalo = "Không hiển thị";
                    data.profile.Facebook = "Không hiển thị";
                    data.profile.LinkedIn = "Không hiển thị";
                    break;
                case 2:
                    
                    if (!classFromUser.Equals(classFromDetail))
                    {
                        data.profile.DateOfBirth = null;
                        data.profile.PhoneNumber = "Không hiển thị";
                        data.profile.Email = "Không hiển thị";
                        data.profile.Skype = "Không hiển thị";
                        data.profile.Zalo = "Không hiển thị";
                        data.profile.Facebook = "Không hiển thị";
                        data.profile.LinkedIn = "Không hiển thị";
                    }
                    break;
                case 0:
                    switch (userCrt.AccessDateOfBirth)
                    {
                        case 1:
                            data.profile.DateOfBirth = null;
                            break;
                        case 2:
                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.DateOfBirth = null;
                            }
                            break;
                    };

                    switch (userCrt.AccessPhoneNumber)
                    {
                        case 1:
                            data.profile.PhoneNumber = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.PhoneNumber = "Không hiển thị";
                            }
                            break;
                    };

                    switch (userCrt.AccessEmail)
                    {
                        case 1:
                            data.profile.Email = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.Email = "Không hiển thị";
                            }
                            break;
                    };

                    switch (userCrt.AccessSkype)
                    {
                        case 1:
                            data.profile.Skype = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.Skype = "Không hiển thị";
                            }
                            break;
                    };

                    switch (userCrt.AccessZalo)
                    {
                        case 1:
                            data.profile.Zalo = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.Zalo = "Không hiển thị";
                            }
                            break;
                    };

                    switch (userCrt.AccessFacebook)
                    {
                        case 1:
                            data.profile.Facebook = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.Facebook = "Không hiển thị";
                            }
                            break;
                    };

                    switch (userCrt.AccessLinkedIn)
                    {
                        case 1:
                            data.profile.LinkedIn = "Không hiển thị";
                            break;
                        case 2:

                            if (!classFromUser.Equals(classFromDetail))
                            {
                                data.profile.LinkedIn = "Không hiển thị";
                            }
                            break;
                    };
                    break;
            };

            return new JsonResult(data);
        }

        [HttpGet("getdetailwkv1")]
        public IActionResult GetDetailWorkingInfo(string id)
        {
            var data = _context.WorkingInfor.Where(u => u.ProfileId.Equals(id)).ToList();

            return new JsonResult(data);
        }

    }
}
