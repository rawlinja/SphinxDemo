using System.Collections.Generic;
using System.Web.Mvc;
using SphinxDemo.Data;
using SphinxDemo.Data.Models;

namespace SphinxDemo.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            var model = SphinxDataAccess.CityData();
            return View(model);         
        }

        [HttpGet]
        public JsonResult Search(string keyword)
        {      
            var models = SphinxDataAccess.CityDataByKeyword(keyword);          

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
            List<CityModel> models = null;

            if (searchModel.Direction == PageDirection.Previous || searchModel.Direction == PageDirection.Next)
            {
                models = SphinxDataAccess.CityDataByKeywordWithPaging(searchModel.Keyword,
                    searchModel.Start, searchModel.Direction, searchModel.PageSize);
            }          
            else if(searchModel.Keyword != null)
            {
                models = SphinxDataAccess.CityDataByKeyword(searchModel.Keyword, 1);
            }
            
            var result = new JsonResult 
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = models
            };
            return result;
        }
    }
}
