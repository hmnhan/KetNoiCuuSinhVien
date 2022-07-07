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
    public class ImpChuyenNganh : IChuyenNganh
    {
        public IEnumerable<Specialization> GetAll(AppDbContext _context, string filter)
        {
            IEnumerable<Specialization> specializations = _context.Specialization.OrderBy(u => u.Name);

            if (!string.IsNullOrEmpty(filter))
            {
                string str = Standard.Build(filter);
                specializations = specializations.Where(u => Standard.Build(u.Name).Contains(str) || Standard.Build(u.Description).Contains(str));
            }
            return specializations;
        }

        public SpecializationVM Create(AppDbContext _context, List<SpecializationPost> specializations)
        {
            List<Specialization> lst = new List<Specialization>();
            Specialization obj;
            try
            {
                foreach (var spc in specializations)
                {
                    obj = new Specialization()
                    {
                        Id = Guid.NewGuid(),
                        Name = spc.Name,
                        Description = spc.Description
                    };

                    lst.Add(obj);
                }

                _context.Specialization.AddRange(lst);

                int totalResult = _context.SaveChanges();
                SpecializationVM spcVM = new SpecializationVM()
                {
                    Specializations = lst,
                    Message = totalResult > 0 ? string.Format("Tạo thành công {0} chuyên ngành", totalResult) : "Không có chuyên ngành nào được tạo"
                };
                return spcVM;
            }
            catch (Exception ex)
            {
                SpecializationVM spcVM = new SpecializationVM()
                {
                    Message = string.Format("Có lỗi xảy ra khi tạo chuyên ngành: {0}", ex.Message)
                };
                return spcVM;
            }
        }   
    }
}
