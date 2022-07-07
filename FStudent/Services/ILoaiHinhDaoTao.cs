using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface ILoaiHinhDaoTao
    {
        public IEnumerable<EducationType> GetAll(AppDbContext _context, string filter);
        public EducationTypeVM Create(AppDbContext _context, List<EducationTypePost> specializations);
    }
}
