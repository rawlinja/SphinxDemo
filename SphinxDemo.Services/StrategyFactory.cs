using SphinxDemo.Data.Models;
namespace SphinxDemo.Services
{
    public enum FactoryModel
    {
        City = 1
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
            }
            return strategy;
        }
    }
}
