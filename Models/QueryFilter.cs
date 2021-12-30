using Microsoft.AspNetCore.Mvc;

namespace xxx.Models
{
  public class QueryFilter
  {
    [FromQuery(Name = "_end")]
    public string End { get; set; }

    [FromQuery(Name = "_sort")]
    public string Sort { get; set; }

    [FromQuery(Name = "_order")]
    public string Order { get; set; }
    
    [FromQuery(Name = "_start")]
    public string Start { get; set; }
  }
}