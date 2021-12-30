using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace xxx.Entities
{
  public class User
  {
    //public int Id { get; set; }
    //public string FirstName { get; set; }
    //public string LastName { get; set; }
    //public int Id { get; set; }

    public string SystemId { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public List<string> Roles { get; set; }
  }
}
