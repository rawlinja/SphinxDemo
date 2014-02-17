using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;
using Dapper;
using SphinxDemo.Data.Models;
using System;

namespace SphinxDemo.Data
{
   
    public class SphinxDataAccess
    {       
        public static List<CityModel> CityData()
        {
            List<CityModel> results;
            const string connectionString = "Server=localhost; Port=9306";
            string query = "SELECT * FROM city";
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CityModel>(query).ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }

        public static List<CityModel> CityDataByKeyword(string keyword, int limit = 1000)
        {
            List<CityModel> results;

            string query = "SELECT * FROM city WHERE MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + limit;
            const string connectionString = "Server=localhost; Port=9306";
            
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CityModel>(query).ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }

        public static List<CityModel> CityDataByKeywordWithPaging(string keyword, int start, 
            PageDirection direction, int pageSize)
        {           
            List<CityModel> results;

            int limit = (direction == PageDirection.Next) ? start + pageSize : start - pageSize;

            string query = (direction == PageDirection.Next) ? "SELECT * FROM city WHERE id > " + 
                start +  " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize
                : "SELECT * FROM city WHERE id BETWEEN " + limit + " AND " + start + " AND MATCH('" + keyword + "') ORDER BY id ASC LIMIT " + pageSize;

            const string connectionString = "Server=localhost; Port=9306";
            try
            {
                using (MySqlConnection connection = new MySqlConnection(connectionString))
                {
                    connection.Open();
                    results = connection.Query<CityModel>(query).ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }

            return results;
        }
    }
}
