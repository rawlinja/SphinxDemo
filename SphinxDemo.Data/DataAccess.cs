using System.Collections.Generic;
using System;
using SphinxDemo.Data.Models;

namespace SphinxDemo.Data
{   
    public class SphinxDataAccess
    { 
        public static IEnumerable<T> SearchByModel<T>(ISearchStrategy<T> strategy, string keyword, int limit = 100)  
        {
            IEnumerable<T> results = null;

            try
            {
                results = strategy.SearchByModel(keyword, limit);
            }
            catch (Exception)
            {
                throw;
            }
            return results;
        }

        public static IEnumerable<T> SearchByModelWithPaging<T>(ISearchStrategy<T> strategy, string keyword, int start,
            int direction, int pageSize)
        {

            IEnumerable<T> results = null;

            try
            {
                results = strategy.SearchByModelWithPaging(keyword, start, direction, pageSize);
            }
            catch (Exception)
            {
                throw;
            }
            return results;
        }
    }
}
