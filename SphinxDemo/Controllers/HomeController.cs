using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SphinxDemo.DAL;

namespace SphinxDemo.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            var model = DAL.SphinxDataAccess.CityData();
            return View(model); 
        
        }

        [HttpGet]
        public JsonResult Search(string keyword)
        {         

            var model = DAL.SphinxDataAccess.CityDataByKeyword(keyword);
            var result = new JsonResult 
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = model
            };
            return result;
        }
    }
}
