using FStudent.Data;
using FStudent.Models;
using FStudent.Models.ViewModels;
using FStudent.Tools;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Services.Implement
{
    public class ImpLopSinhHoat : ILopSinhHoat
    {
        public ActivityClassVM Create(AppDbContext _context, Guid academicYearId, List<ActivityClassPost> postData)
        {
            List<ActivityClass> lst = new List<ActivityClass>();
            ActivityClass obj;
            try
            {
                foreach (var item in postData)
                {
                    obj = new ActivityClass()
                    {
                        Id = Guid.NewGuid(),
                        Name = item.Name,
                        AcademicYearId = academicYearId,
                        SpecializationId = item.SpecializationId,
                        ShortDesc = item.Description
                    };

                    lst.Add(obj);
                }

                _context.ActivityClass.AddRange(lst);

                int totalResult = _context.SaveChanges();
                ActivityClassVM vm = new ActivityClassVM()
                {
                    ActivityClasses = lst,
                    Message = totalResult > 0 ? string.Format("Tạo thành công {0} lớp sinh hoạt", totalResult) : "Không có lớp sinh hoạt nào được tạo"
                };
                return vm;
            }
            catch (Exception ex)
            {
                ActivityClassVM vm = new ActivityClassVM()
                {
                    Message = string.Format("Có lỗi xảy ra khi tạo lớp sinh hoạt: {0}", ex.Message)
                };
                return vm;
            }
        }

        public IEnumerable<ActivityClass> GetAll(AppDbContext _context, ActivityClassFilter filter)
        {
            IEnumerable<ActivityClass> data = _context.ActivityClass.Include(u => u.AcademicYear).Include(u => u.Specialization)
                .OrderBy(u => u.Name)
                .ThenBy(u => u.Specialization.Name)
                .ThenByDescending(u => u.AcademicYear.Academic);

            if (!string.IsNullOrEmpty(filter.Filter))
            {
                string str = Standard.Build(filter.Filter);
                data = data.Where(u => Standard.Build(u.Name).Contains(str) || Standard.Build(u.ShortDesc).Contains(str));
            }

            if (filter.AcaYearId != null)
            {
                data = data.Where(u => u.AcademicYearId.Equals(filter.AcaYearId));
            }

            if (filter.SpecializationId != null)
            {
                data = data.Where(u => u.SpecializationId.Equals(filter.SpecializationId));
            }

            return data;
        }
    }
}
