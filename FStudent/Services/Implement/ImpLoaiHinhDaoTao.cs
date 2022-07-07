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
    public class ImpLoaiHinhDaoTao : ILoaiHinhDaoTao
    {
        public EducationTypeVM Create(AppDbContext _context, List<EducationTypePost> postData)
        {
            List<EducationType> lst = new List<EducationType>();
            EducationType obj;
            try
            {
                foreach (var item in postData)
                {
                    obj = new EducationType()
                    {
                        Id = Guid.NewGuid(),
                        Name = item.Name,
                        ShortDesc = item.Description
                    };

                    lst.Add(obj);
                }

                _context.EducationType.AddRange(lst);

                int totalResult = _context.SaveChanges();
                EducationTypeVM spcVM = new EducationTypeVM()
                {
                    EducationTypes = lst,
                    Message = totalResult > 0 ? string.Format("Tạo thành công {0} loại hình đào tạo", totalResult) : "Không có loại hình đào tạo nào được tạo"
                };
                return spcVM;
            }
            catch (Exception ex)
            {
                EducationTypeVM spcVM = new EducationTypeVM()
                {
                    Message = string.Format("Có lỗi xảy ra khi tạo loại hình đào tạo: {0}", ex.Message)
                };
                return spcVM;
            }
        }

        public IEnumerable<EducationType> GetAll(AppDbContext _context, string filter)
        {
            IEnumerable<EducationType> data = _context.EducationType.OrderBy(u => u.Name);

            if (!string.IsNullOrEmpty(filter))
            {
                string str = Standard.Build(filter);
                data = data.Where(u => Standard.Build(u.Name).Contains(str) || Standard.Build(u.ShortDesc).Contains(str));
            }
            return data;
        }
    }
}
