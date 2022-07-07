using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using FStudent.Tools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services.Implement
{
    public class ImpUpdateProfile : IUpdateProfile
    {
        public bool CheckValidate(AppDbContext _context, Profile profile)
        {
            var learningInforIfExist = _context.LearningInfor.Find(profile.Id);

            if (string.IsNullOrEmpty(profile.FullName)
                || string.IsNullOrEmpty(profile.Email)
                || string.IsNullOrEmpty(profile.PhoneNumber)
                || learningInforIfExist == null)
            {
                return false;
            }
            return true;
        }

        public WorkingInforVM CreateWorkingInfor(AppDbContext _context, string userId, WorkingInforPostData postData)
        {
            var wi = new WorkingInfor()
            {
                Id = Guid.NewGuid(),
                ProfileId = userId,
                Workplace = postData.WorkPlace,
                StartYear = postData.StartYear,
                EndYear = postData.EndYear
            };

            _context.Add(wi);
            _context.SaveChanges();

            WorkingInforVM spcVM = new WorkingInforVM()
            {
                WorkingInfor = wi,
                Message = $"Tạo công việc {wi.Workplace} thành công"
            };
            return spcVM;
        }

        public IEnumerable<LearningInfor> GetLearningInfor(AppDbContext _context)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Profile> SearchProfiles(AppDbContext _context, string userId, string filter, ProfileFilter prfFilter)
        {
            var data = _context.Profile.Join(_context.LearningInfor, pf => pf.Id, li => li.ProfileId, (pf, li) => new { profile = pf, learningInfor = li })
                .Join(_context.ActivityClass, li => li.learningInfor.ActivityClassId, ac => ac.Id, (li, ac) => new { profile = li.profile, activityClass = ac })
                .Join(_context.Specialization, li => li.activityClass.SpecializationId, spc => spc.Id, (li, spc) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = spc })
                .Join(_context.AcademicYear, li => li.activityClass.AcademicYearId, ay => ay.Id, (li, ay) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = ay })
                .Join(_context.EducationType, li => li.academicYear.EducationTypeId, et => et.Id, (li, et) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = et })
                .Where(u => !u.profile.Id.Equals(userId)).ToList();

            if (!string.IsNullOrEmpty(filter))
            {
                string str = Standard.Build(filter);
                data = data.Where(u => Standard.Build(u.profile.NickName).Contains(str) || Standard.Build(u.profile.FullName).Contains(str)).ToList();
            }

            if (prfFilter.ActClassId != null)
            {
                data = data.Where(u => u.activityClass.Id.Equals(prfFilter.ActClassId)).ToList();
            }
            else
            {
                if (prfFilter.SpcId != null)
                {
                    data = data.Where(u => u.specialiaztion.Id.Equals(prfFilter.SpcId)).ToList();
                }

                if (prfFilter.AcaYearId != null)
                {
                    data = data.Where(u => u.academicYear.Id.Equals(prfFilter.AcaYearId)).ToList();
                }
                else
                {
                    if (prfFilter.EduTypeId != null)
                    {
                        data = data.Where(u => u.educationType.Id.Equals(prfFilter.EduTypeId)).ToList();
                    }
                }

            }

            IEnumerable<Profile> prfs = data.Select(u => u.profile);
            return prfs;
        }
    }
}
