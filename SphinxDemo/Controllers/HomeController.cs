using System.Collections.Generic;
using System.Web.Mvc;
using SphinxDemo.Services;
using SphinxDemo.Services.Models;

namespace SphinxDemo.WebUI.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        [HttpGet]
        public ActionResult Index()
        {
            var model = repository.Search();
            return View(model);         
        }
        [HttpGet]
        public JsonResult Search(string keyword)
        {      
            var models = repository.SearchByKeyword(keyword);           
            var result = new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = models
            };
            return result;
        }
        [HttpPost]
        public JsonResult Search(SearchModel searchModel)
        {
            IEnumerable<CityModel> models = null;

            if (searchModel.Direction == PageDirection.Previous || searchModel.Direction == PageDirection.Next)
            {
                models = repository.SearchByKeywordWithPaging(searchModel);
            }          
            else if(searchModel.Keyword != null)
            {
                models = repository.SearchByKeyword(searchModel.Keyword);
            }
            
            var result = new JsonResult 
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = models
            };
            return result;
        }

        Repository<CityModel> repository = Repository<CityModel>.Instance;
    }
}
