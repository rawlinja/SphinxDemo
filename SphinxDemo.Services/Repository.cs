using System.Collections.Generic;
using SphinxDemo.Data;
using SphinxDemo.Services.Models;
using SphinxDemo.Data.Models;

namespace SphinxDemo.Services
{
    public class Repository<TModel> where TModel: IModel
    {
        private Repository() { }
         
        public static Repository<TModel> Instance
        {
            get
            {
                if (_instance == null) { _instance = new Repository<TModel>(); }
                return _instance;    
            }
        }
        public IEnumerable<TModel> SearchByModelWithPaging(SearchModel searchModel){
            var items = SphinxDataAccess.SearchByModelWithPaging<TModel>(StrategyFactory<TModel>.SearchStrategy( (FactoryModel) searchModel.MenuSelection),
                searchModel.Keyword, searchModel.Start, (int) searchModel.Direction, searchModel.PageSize);
            return items;
        }
        public IEnumerable<TModel> SearchByModel(SearchModel searchModel) 
        {                       var items = SphinxDataAccess.SearchByModel<TModel>(StrategyFactory<TModel>.SearchStrategy((FactoryModel) searchModel.MenuSelection),
                searchModel.Keyword);
            return items;
        }
        public IEnumerable<TModel> SearchByKeyword(string keyword)
        {
            var items = SphinxDataAccess.SearchByModel<TModel>(StrategyFactory<TModel>.SearchStrategy(FactoryModel.City),
                keyword);
            return items;
        }
        public IEnumerable<TModel> Search()
        {
            var items = SphinxDataAccess.SearchByModel<TModel>(
                StrategyFactory<TModel>.SearchStrategy(FactoryModel.City), "");
            return items;
        }

        private static Repository<TModel> _instance = new Repository<TModel>();  
    }
}
