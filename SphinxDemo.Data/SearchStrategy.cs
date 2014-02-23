using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using Dapper;

namespace SphinxDemo.Data.Models
{
    public interface ISearchStrategy<TModel> 
    {
        IEnumerable<TModel> SearchByModel(string keyword, int limit);
        IEnumerable<TModel> SearchByModelWithPaging(string keyword, int start, int direction, int pageSize); 
    }

    public abstract class SearchStrategy: ISearchStrategy<IModel>
    {
        public abstract IEnumerable<IModel> SearchByModelWithPaging(string keyword, int start, int direction, int pageSize);       
        public abstract IEnumerable<IModel> SearchByModel(string keyword, int limit);
    }

    public class CitySearchStrategy: SearchStrategy 
    {       

        public override IEnumerable<IModel> SearchByModel(string keyword, int limit) 
        {
            IEnumerable<CityModel> results = null;

            string query = "SELECT * FROM city WHERE MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + limit;
            const string connectionString = "Server=localhost; Port=9306";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CityModel>(query);
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }
        public override IEnumerable<IModel> SearchByModelWithPaging(string keyword, int start,
            int direction, int pageSize)
        {
            IEnumerable<CityModel> results;

            int limit = (direction == Next) ? start + pageSize : start - pageSize;

            string query = (direction == Next) ? "SELECT * FROM city WHERE id > " +
                start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize
                : "SELECT * FROM city WHERE id BETWEEN " + limit + " AND " + start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize;

            const string connectionString = "Server=localhost; Port=9306";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CityModel>(query);
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }


        public const int Next = 2;
    }

    public class CountrySearchStrategy : SearchStrategy
    {

        public override IEnumerable<IModel> SearchByModel(string keyword, int limit)
        {
            IEnumerable<CountryModel> results = null;

            string query = "SELECT * FROM country WHERE MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + limit;
            const string connectionString = "Server=localhost; Port=9306";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CountryModel>(query);
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }
        public override IEnumerable<IModel> SearchByModelWithPaging(string keyword, int start,
            int direction, int pageSize)
        {
            IEnumerable<CountryModel> results;

            int limit = (direction == Next) ? start + pageSize : start - pageSize;

            string query = (direction == Next) ? "SELECT * FROM country WHERE id > " +
                start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize
                : "SELECT * FROM city WHERE id BETWEEN " + limit + " AND " + start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize;

            const string connectionString = "Server=localhost; Port=9306";

            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CountryModel>(query);
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }


        public const int Next = 2;
    }
}
