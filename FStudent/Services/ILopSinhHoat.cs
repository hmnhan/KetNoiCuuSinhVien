using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface ILopSinhHoat
    {
        public IEnumerable<ActivityClass> GetAll(AppDbContext _context, ActivityClassFilter filter);
        public ActivityClassVM Create(AppDbContext _context, Guid academicYearId, List<ActivityClassPost> postData);
    }
}
