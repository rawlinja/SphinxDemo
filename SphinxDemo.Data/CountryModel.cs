namespace SphinxDemo.Data.Models
{
    public class CountryModel : IModel
    {
        public string Name {get; set; }
        public string Continent { get; set; }
        public string Region { get; set; }
        public int Population { get; set; }
        public double GNP { get; set; }
        public string Capital { get; set; }
    }
}
