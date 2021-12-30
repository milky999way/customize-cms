//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace xxx.Controllers
//{
//  public class AppcenterUsersController : Controller
//  {
//    public List<AppcenterGame> Index()
//    {
//      Response.Headers.Add("X-Total-Count", "10");

//      var aa = new List<AppcenterGame>();
//      aa.Add(new AppcenterGame() { Id = 1, Icon = "aaa", Title = "포코포코", Body = "AAA", UpdateDate = 2021 });
//      return aa;
//    }
//  }

//  public class AppcenterUser
//  {
//    public int Id { get; set; }
//    public string Icon { get; set; }
//    public string Title { get; set; }
//    public string Body { get; set; }
//    public int UpdateDate { get; set; }
//  }
//}
