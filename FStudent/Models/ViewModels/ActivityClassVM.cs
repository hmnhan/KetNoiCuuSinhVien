using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class ActivityClassVM
    {
        public IEnumerable<ActivityClass> ActivityClasses { get; set; }
        public ActivityClass ActivityClass { get; set; }
        public IEnumerable<SelectListItem> AcademicYearSelectList { get; set; }
        public IEnumerable<SelectListItem> SpecializationSelectList { get; set; }
        public string Message { get; set; }
    }

    public class ActivityClassFilter
    {
        public Guid? SpecializationId { get; set; }
        public Guid? AcaYearId { get; set; }
        public string Filter { get; set; }
    }

    public class ActivityClassPost
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? SpecializationId { get; set; }
    }

    public class ActivityClassPostData
    {
        public Guid AcademicYearId { get; set; }
        public List<ActivityClassPost> Data { get; set; }
    }

    public class ActivityClassPutData
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? AcademicYearId { get; set; }
        public Guid? SpecializationId { get; set; }
        public string ShortDesc { get; set; }
    }
}
