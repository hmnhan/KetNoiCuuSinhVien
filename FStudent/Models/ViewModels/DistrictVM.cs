using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class DistrictVM
    {
        public IEnumerable<District> Districts { get; set; }
        public District District { get; set; }
        public IEnumerable<SelectListItem> ProvinceSelectList { get; set; }
        public Province Province { get; set; }
    }
}
