using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Models.ViewModels
{
    public class ResultVM<Spl, Flt>
    {
        public Spl Data { get; set; }

        public Flt Filter { get; set; }
    }
}
