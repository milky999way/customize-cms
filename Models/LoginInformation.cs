using Google.Apis.Drive.v3.Data;
using Microsoft.AspNetCore.Authentication;
using System.Collections.Generic;
using System.Net.Security;

namespace xxx.Models
{
  public class LoginInformation
  {
    public Data Data { get; set; }
  }
  public class Data
  {
    public User User { get; set; }
  }
  public class User
  {
    public string SystemId { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public List<string> Roles { get; set; }
  }
}