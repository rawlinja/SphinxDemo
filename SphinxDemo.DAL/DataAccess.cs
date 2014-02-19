using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;
using Dapper;
using System;
using SphinxDemo.Data.Models;

namespace SphinxDemo.Data
{   
    public class SphinxDataAccess
    { 
        public static IEnumerable<T> SearchByKeyword<T>(ISearchStrategy<T> strategy, string keyword, int limit = 100)  
        {
            IEnumerable<T> results = null;

            try
            {
                results = strategy.SearchByKeyword(keyword, limit);
            }
            catch (Exception)
            {
                throw;
            }
            return results;
        }

        public static IEnumerable<T> SearchByKeywordWithPaging<T>(ISearchStrategy<T> strategy, string keyword, int start,
            int direction, int pageSize)
        {

            IEnumerable<T> results = null;

            try
            {
                results = strategy.SearchByKeywordWithPaging(keyword, start, direction, pageSize);
            }
            catch (Exception)
            {
                throw;
            }
            return results;
        }
    }
}
