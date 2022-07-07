using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface INienKhoa
    {
        public IEnumerable<AcademicYear> GetAll(AppDbContext _context, AcademicYearFilter filter);
        public AcademicYearVM Create(AppDbContext _context, Guid educationTypeId, List<AcademicYearPost> postData);
    }
}
