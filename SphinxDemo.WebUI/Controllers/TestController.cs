using System.Collections.Generic;
using System.Web.Mvc;
using SphinxDemo.Services;
using SphinxDemo.Services.Models;
using SphinxDemo.Data.Models;

namespace SphinxDemo.WebUI.Controllers
{
    public class TestController : Controller 
    {        //
        // GET: /Home/
        [HttpGet]
        public ActionResult Index()
        {           
            return View();         
        }
   
    }
}