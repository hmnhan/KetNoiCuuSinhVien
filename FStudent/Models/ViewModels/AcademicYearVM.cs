using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class AcademicYearVM
    {
        public IEnumerable<AcademicYear> AcademicYears { get; set; }
        public AcademicYear AcademicYear { get; set; }
        public IEnumerable<SelectListItem> EducationTypeSelectList { get; set; }
        public string Message { get; set; }
    }

    public class AcademicYearPostData
    {
        public Guid Id { get; set; }
        public List<AcademicYearPost> data { get; set; }
    }

    public class AcademicYearPutData
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Academic { get; set; }
        public Guid? EducationTypeId { get; set; }
        public string Description { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }

    public class AcademicYearPost
    {
        public string Name { get; set; }
        public int Academic { get; set; }
        public string Description { get; set; }
        public int StartYear { get; set; }
        public int EndYear { get; set; }
    }

    public class AcademicYearFilter
    {
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public Guid? EduTypeId { get; set; }
        public string Filter { get; set; }
    }
}
