using System.Collections.Generic;
using SphinxDemo.Data;
using SphinxDemo.Services.Models;
using SphinxDemo.Data.Models;

namespace SphinxDemo.Services
{
    public class Repository<T> where T: IModel
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
            var items = SphinxDataAccess.SearchByKeywordWithPaging<T>(StrategyFactory<T>.SearchStrategy(FactoryModel.City),
                searchModel.Keyword, searchModel.Start, (int) searchModel.Direction, searchModel.PageSize);
            return items;
        }
        public IEnumerable<T> SearchByKeyword(string keyword) 
        {
            var items = SphinxDataAccess.SearchByKeyword<T>(StrategyFactory<T>.SearchStrategy(FactoryModel.City),
                keyword);
            return items;
        }
        public IEnumerable<T> Search()
        {
            var items = SphinxDataAccess.SearchByKeyword<T>(
                StrategyFactory<T>.SearchStrategy(FactoryModel.City), "");
            return items;
        }

        private static Repository<T> _instance = new Repository<T>();  
    }
}
