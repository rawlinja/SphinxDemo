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
        public static List<CityModel> GetCityData()
        {
            List<CityModel> results;
            const string connectionString = "Server=localhost; Port=9303";
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                connection.Open();
                results = connection.Query<CityModel>("SELECT * FROM city").ToList();
            }

            return results;
        }
    }
}
