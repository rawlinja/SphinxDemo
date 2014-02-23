using SphinxDemo.Data.Models;
namespace SphinxDemo.Services
{
    public enum FactoryModel
    {
        None = 0,
        City = 1,
        Country = 2
    }

    public class StrategyFactory<TModel> where TModel: IModel
    {
        public static ISearchStrategy<TModel> SearchStrategy(FactoryModel model)
        {
            ISearchStrategy<TModel> strategy = null;
            switch (model)
            {
                case FactoryModel.City:
                    strategy = (ISearchStrategy<TModel>) new CitySearchStrategy();
                    break;
                case FactoryModel.Country:
                    strategy = (ISearchStrategy<TModel>) new CountrySearchStrategy();
                    break;
            }
            return strategy;
        }
    }
}
