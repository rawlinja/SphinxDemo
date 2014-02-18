using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;
using Dapper;
using System;

namespace SphinxDemo.Data
{   
    public class SphinxDataAccess
    { 
        public static IEnumerable<T> SearchByKeyword<T>(string keyword, int limit = 100) 
        {
            IEnumerable<T> results;

            string query = "SELECT * FROM city WHERE MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + limit;
            const string connectionString = "Server=localhost; Port=9306";
            
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<T>(query);
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }

        public static IEnumerable<T> SearchByKeywordWithPaging<T>(string keyword, int start, 
            int direction, int pageSize)
        {           
            IEnumerable<T> results;            

            int limit = (direction == Next) ? start + pageSize : start - pageSize;

            string query = (direction == Next) ? "SELECT * FROM city WHERE id > " + 
                start +  " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize
                : "SELECT * FROM city WHERE id BETWEEN " + limit + " AND " + start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize;

            const string connectionString = "Server=localhost; Port=9306";
           
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<T>(query);
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
