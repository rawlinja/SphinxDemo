using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using SphinxDemo.Data;
using SphinxDemo.Data.Models;


namespace SphinxDemo.Test.Data
{
    [TestFixture]
    public class DataAccessUnitTest
    {
        [Test]
        public void SearchByCityModel()
        {
            IEnumerable<IModel> results = SphinxDataAccess.SearchByModel<IModel>(new CitySearchStrategy(), "", 100);
            bool count = results.ToList().Count > 2000 ? true : false;
            Assert.IsNotEmpty(results);
            Assert.IsFalse(count); 
            
        }

    }
}