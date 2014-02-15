using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SphinxDemo.Data
{
    public enum PageDirection : int
    {
        Previous = 1,
        Next = 2,
        None = 0
    }

    public class SearchModel
    {
        public string Keyword { get; set; }
        public int Current { get; set; }
        public PageDirection Direction { get; set; }
    }
}
