using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SphinxDemo.Data;
using SphinxDemo.Services.Models;

namespace SphinxDemo.Services
{
    public class Repository<T>
    {
        private Repository() { }
         
        public static Repository<T> Instance
        {
            get
            {
                if (_instance == null) { _instance = new Repository<T>(); }
                return _instance;    
            }
        }
        public IEnumerable<T> SearchByKeywordWithPaging(SearchModel searchModel){
            var items = SphinxDataAccess.SearchByKeywordWithPaging<T>(searchModel.Keyword,
                    searchModel.Start, (int) searchModel.Direction, searchModel.PageSize);
            return items;
        }
        public IEnumerable<T> SearchByKeyword(string keyword)
        {
            var items = SphinxDataAccess.SearchByKeyword<T>(keyword);
            return items;
        }
        public IEnumerable<T> Search()
        {
            var items = SphinxDataAccess.SearchByKeyword<T>("");
            return items;
        }

        private static Repository<T> _instance = new Repository<T>();  
    }
}
