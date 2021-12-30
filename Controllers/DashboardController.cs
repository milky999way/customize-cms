using Microsoft.AspNetCore.Mvc;

namespace xxx.Controllers
{
  [Authorize]
  public class DashboardController : Controller
  {
    public IActionResult Index()
    {
      return Ok();
    }
  }
}
