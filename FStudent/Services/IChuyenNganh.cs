using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services
{
    public interface IChuyenNganh
    {
        public IEnumerable<Specialization> GetAll(AppDbContext _context, string filter);
        public SpecializationVM Create(AppDbContext _context, List<SpecializationPost> specializations);
    }
}
