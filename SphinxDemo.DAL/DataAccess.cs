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

        public static List<CityModel> CityDataByKeyword(string keyword)
        {
            List<CityModel> results;
            string query = "SELECT * FROM city WHERE MATCH('" + keyword + "')";
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

        public static List<CityModel> CityDataByKeywordWithPaging(string keyword, int current, PageDirection direction)
        {
            const int PageSize = 20;

            List<CityModel> results;
            string query = (direction == PageDirection.Next) ? "SELECT * FROM city WHERE id > " + 
                current + " AND id < " + (current + PageSize) + " AND MATCH('" + keyword + "') ORDER BY id ASC"
                : "SELECT * FROM city WHERE id < " +
                current + " AND id >= " + (current - PageSize) + " AND MATCH('" + keyword + "') ORDER BY id ASC";

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
