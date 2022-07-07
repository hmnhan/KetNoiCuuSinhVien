using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using FStudent.Tools;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services.Implement
{
    public class ImpProfile : IProfile
    {
        public IEnumerable<AcademicYear> GetAcademicYear(AppDbContext _context, Guid? eduTypeId)
        {
            IEnumerable<AcademicYear> data = _context.AcademicYear.Include(u => u.EducationType).OrderByDescending(u => u.Academic);

            if (eduTypeId != null)
            {
                data = data.Where(u => u.EducationTypeId.Equals(eduTypeId));
            }

            return data;
        }

        public IEnumerable<ActivityClass> GetActivityClass(AppDbContext _context, Guid? acaYearId, Guid? spcId)
        {
            IEnumerable<ActivityClass> data = _context.ActivityClass.Include(u => u.AcademicYear).Include(u => u.Specialization)
                .OrderBy(u => u.Name)
                .ThenBy(u => u.Specialization.Name)
                .ThenByDescending(u => u.AcademicYear.Academic);
            if (acaYearId != null)
            {
                data = data.Where(u => u.AcademicYearId.Equals(acaYearId));
            }

            if (spcId != null)
            {
                data = data.Where(u => u.SpecializationId.Equals(spcId));
            }
            return data;
        }

        public IEnumerable<EducationType> GetEducationType(AppDbContext _context)
        {
            IEnumerable<EducationType> data = _context.EducationType.OrderBy(u => u.Name);
            return data;
        }

        public IEnumerable<Profile> GetProfiles(AppDbContext _context, ProfileFilter filter)
        {
            var data = _context.Profile.Join(_context.LearningInfor, pf => pf.Id, li => li.ProfileId, (pf, li) => new { profile = pf, learningInfor = li })
                .Join(_context.ActivityClass, li => li.learningInfor.ActivityClassId, ac => ac.Id, (li, ac) => new { profile = li.profile, activityClass = ac })
                .Join(_context.Specialization, li => li.activityClass.SpecializationId, spc => spc.Id, (li, spc) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = spc })
                .Join(_context.AcademicYear, li => li.activityClass.AcademicYearId, ay => ay.Id, (li, ay) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = ay })
                .Join(_context.EducationType, li => li.academicYear.EducationTypeId, et => et.Id, (li, et) => new { profile = li.profile, activityClass = li.activityClass, specialiaztion = li.specialiaztion, academicYear = li.academicYear, educationType = et }).ToList();

            if (filter.ActClassId != null)
            {
                data = data.Where(u => u.activityClass.Id.Equals(filter.ActClassId)).ToList();
            }
            else
            {
                if (filter.SpcId != null)
                {
                    data = data.Where(u => u.specialiaztion.Id.Equals(filter.SpcId)).ToList();
                }

                if (filter.AcaYearId != null)
                {
                    data = data.Where(u => u.academicYear.Id.Equals(filter.AcaYearId)).ToList();
                }
                else
                {
                    if (filter.EduTypeId != null)
                    {
                        data = data.Where(u => u.educationType.Id.Equals(filter.EduTypeId)).ToList();
                    }
                }

            }

            IEnumerable<Profile> profileData = data.Select(u => u.profile);
            return profileData;
        }

        public IEnumerable<Specialization> GetSpecialization(AppDbContext _context)
        {
            IEnumerable<Specialization> specializations = _context.Specialization.OrderBy(u => u.Name);

            return specializations;
        }
    }
}
