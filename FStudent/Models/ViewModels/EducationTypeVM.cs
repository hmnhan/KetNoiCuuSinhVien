using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class EducationTypeVM
    {
        public IEnumerable<EducationType> EducationTypes { get; set; }
        public EducationType EducationType { get; set; }
        public string Message { get; set; }
    }

    public class EducationTypePost
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
