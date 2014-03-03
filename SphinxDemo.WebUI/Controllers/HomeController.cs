using System.Collections.Generic;
using System.Web.Mvc;
using SphinxDemo.Services;
using SphinxDemo.Services.Models;
using SphinxDemo.Data.Models;

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
            IEnumerable<IModel> models = null;

            searchModel.Keyword = (searchModel.Keyword == null) ? string.Empty: searchModel.Keyword;

            if (searchModel.Direction != PageDirection.None)
            {
                models = repository.SearchByModelWithPaging(searchModel);
            }          
            else if(searchModel.MenuSelection != FactoryModel.None) 
            {
                models = repository.SearchByModel(searchModel);
            }
            
            var result = new JsonResult 
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = models
            };
            return result;
        }

        public ActionResult Test()
        {

            return View();
        }

        Repository<IModel> repository = Repository<IModel>.Instance;
    }
}