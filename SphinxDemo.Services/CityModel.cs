using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SphinxDemo.Services.Models
{
    public class CityModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public string District { get; set; }
        public int Population { get; set; }
    }
}