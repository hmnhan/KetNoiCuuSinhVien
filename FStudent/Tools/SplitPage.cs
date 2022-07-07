using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudent.Tools
{
    public class SplitPage<Lst>
    {
        public IEnumerable<Lst> items { get; set; }
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
        public int totalRecords { get; set; }
        public int pageCount { get; set; }

        public static SplitPage<Lst> Split(IEnumerable<Lst> listObj, int pageIndex, int pageSize)
        {
            SplitPage<Lst> lst = null;

            if (pageIndex >= 1 && pageSize >= 1)
            {
                int totalItems = listObj.Count();
                int totalPage = totalItems / pageSize;
                if (totalItems % pageSize != 0)
                {
                    totalPage++;
                }

                lst = new SplitPage<Lst>()
                {
                    items = listObj.Skip((pageIndex - 1) * pageSize).Take(pageSize),
                    pageIndex = pageIndex,
                    pageSize = pageSize,
                    totalRecords = totalItems,
                    pageCount = totalPage
                };
            }

            return lst;
        }
    }
}
