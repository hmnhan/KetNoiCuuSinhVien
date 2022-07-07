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
    public class ImpNienKhoa : INienKhoa
    {
        public AcademicYearVM Create(AppDbContext _context, Guid educationTypeId, List<AcademicYearPost> postData)
        {
            List<AcademicYear> lst = new List<AcademicYear>();
            AcademicYear obj;
            try
            {
                foreach (var item in postData)
                {
                    obj = new AcademicYear()
                    {
                        Id = Guid.NewGuid(),
                        Name = item.Name,
                        Academic = item.Academic,
                        EducationTypeId = educationTypeId,
                        ShortDesc = item.Description,
                        StartYear = item.StartYear,
                        EndYear = item.EndYear
                    };

                    lst.Add(obj);
                }

                _context.AcademicYear.AddRange(lst);

                int totalResult = _context.SaveChanges();
                AcademicYearVM vm = new AcademicYearVM()
                {
                    AcademicYears = lst,
                    Message = totalResult > 0 ? string.Format("Tạo thành công {0} niên khóa", totalResult) : "Không có niên khóa nào được tạo"
                };
                return vm;
            }
            catch (Exception ex)
            {
                AcademicYearVM vm = new AcademicYearVM()
                {
                    Message = string.Format("Có lỗi xảy ra khi tạo niên khóa: {0}", ex.Message)
                };
                return vm;
            }
        }

        public IEnumerable<AcademicYear> GetAll(AppDbContext _context, AcademicYearFilter filter)
        {
            IEnumerable<AcademicYear> data = _context.AcademicYear.Include(u => u.EducationType).OrderByDescending(u => u.Academic);

            if (!string.IsNullOrEmpty(filter.Filter))
            {
                string str = Standard.Build(filter.Filter);
                data = data.Where(u => Standard.Build(u.Name).Contains(str) || Standard.Build(u.ShortDesc).Contains(str));
            }

            if (filter.EduTypeId != null)
            {
                data = data.Where(u => u.EducationTypeId.Equals(filter.EduTypeId));
            }

            if (filter.StartYear != null)
            {
                data = data.Where(u => u.StartYear >= filter.StartYear);
            }

            if (filter.EndYear != null)
            {
                data = data.Where(u => u.EndYear <= filter.EndYear);
            }
            return data;
        }
    }
}
