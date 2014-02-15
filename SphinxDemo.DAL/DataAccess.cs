using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Dapper;

namespace SphinxDemo.DAL
{
    public class CityModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public string District { get; set; }
        public int Population { get; set; }
    }

    public class SphinxDataAccess
    {
        public static List<CityModel> CityData()
        {
            List<CityModel> results;
            const string connectionString = "Server=localhost; Port=9306";
            string query = "SELECT * FROM city";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                results = connection.Query<CityModel>(query).ToList();
            }

            return results;
        }

        public static List<CityModel> CityDataByKeyword(string keyword)
        {
            List<CityModel> results;
            string query = "SELECT * FROM city WHERE MATCH('" + keyword + "')";
            const string connectionString = "Server=localhost; Port=9306";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                results = connection.Query<CityModel>(query).ToList();
            }

            return results;
        }
    }
}
