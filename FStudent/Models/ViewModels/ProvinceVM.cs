using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class ProvinceVM
    {
        public IEnumerable<Province> Provinces { get; set; }
        public Province Province { get; set; }
    }
}
