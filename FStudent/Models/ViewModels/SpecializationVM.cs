using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class SpecializationVM
    {
        public IEnumerable<Specialization> Specializations { get; set; }
        public Specialization Specialization { get; set; }
        public string Message { get; set; }
    }

    public class SpecializationPost
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
