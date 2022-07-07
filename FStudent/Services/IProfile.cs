using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface IProfile
    {
        public IEnumerable<Specialization> GetSpecialization(AppDbContext _context);
        public IEnumerable<EducationType> GetEducationType(AppDbContext _context);
        public IEnumerable<AcademicYear> GetAcademicYear(AppDbContext _context, Guid? eduTypeId);
        public IEnumerable<ActivityClass> GetActivityClass(AppDbContext _context, Guid? acaYearId, Guid? spcId);

        //Service for Profile
        public IEnumerable<Profile> GetProfiles(AppDbContext _context, ProfileFilter filter);
    }
}
