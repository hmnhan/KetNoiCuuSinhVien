using System.Collections.Generic;

namespace FStudent.Models.ViewModels
{
    public class GenderVM
    {
        public IEnumerable<Gender> Genders { get; set; }
        public Gender Gender { get; set; }
    }
}
