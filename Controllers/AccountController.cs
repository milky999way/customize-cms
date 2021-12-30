using xxx.Helpers;
using xxx.Models;
//using xxx.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace xxx.Controllers
{
  [AllowAnonymous]
  public class AccountController : Controller
  {
    private readonly AppSettings _appSettings;
    private readonly IHttpClientFactory _clientFactory;
    //private IUserService _userService;
    public AccountController(IOptions<AppSettings> appSettings, IHttpClientFactory clientFactory)
    {
      _appSettings = appSettings.Value;
      _clientFactory = clientFactory;
      //_userService = userService;
    }



    [Route("google-login")]
    public IActionResult GoogleLogin()
    {
      var properties = new AuthenticationProperties { RedirectUri = Url.Action("GoogleResponse") };
      return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }



    [Route("google-response")]
    public async Task<ActionResult> GoogleResponse()
    {
      var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
      var claims = result.Principal;
      var userInfos = claims.Identities.FirstOrDefault().Claims.Select(claim => new
      {
        claim.Issuer,
        claim.OriginalIssuer,
        claim.Type,
        claim.Value
      });
      var googleLoginEmail = "";
      foreach (var userInfo in userInfos.ToList())
      {
        if (userInfo.Type.Contains("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"))
        {
          googleLoginEmail = userInfo.Value;
          break;
        }
      }
      
      //List<string> list = new List<string>();
      //foreach (var userInfo in userInfos)
      //{
      //  list.Add(userInfo.Value);
      //}

      //AuthenticateRequest model = new AuthenticateRequest()
      //{
      //  UserId = googleLoginEmail
      //};
      //var responseToken = _userService.Authenticate(model);

      var request = new HttpRequestMessage(HttpMethod.Get, "https://www.xxx.com/api/authenticator/permissionset?userid=" + googleLoginEmail);
      request.Headers.Add("X-xxx-Authenticator-SystemId", "");
      request.Headers.Add("X-xxx-Authenticator-SecretKey", "");
      var client = _clientFactory.CreateClient();
      var response = await client.SendAsync(request);
      if (response.IsSuccessStatusCode)
      {
        // xxx에 접근권한이 있는 계정(토큰 발급할때 기준은... UserId?? Roles??)
        using var responseStream = await response.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true
        };
        var user = await System.Text.Json.JsonSerializer.DeserializeAsync<LoginInformation>(responseStream, options);

        // return null if user not found
        if (user == null) return null;
        // authentication successful so generate jwt token
        var token = generateJwtToken(user);
        //return new AuthenticateResponse(user, token);
        //var userData = JsonSerializer.Serialize(user.Data.User.Roles);
        //ViewData["authxxxUser"] = userData;
        ViewData["authxxxInfo"] = token;
        return View("Login");

        ////var emailInfo = list.Last();
        ////var authxxxInfo = await Authxxx(emailInfo);
        //ViewData["authxxxInfo"] = "aaa";
        //return View("Login");
      }
      else
      {
        // xxx에 접근권한이 없는 계정
        // return BadRequest();
        return View("AccessDenied");
      }
    }
    private string generateJwtToken(LoginInformation user)
    {
      // generate token that is valid for 7 days
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

      var claimslist = new List<Claim>();
      //var aa = new List<Claim>().ToList();
      claimslist.Add(new Claim("systemId", user.Data.User.SystemId));
      claimslist.Add(new Claim("userId", user.Data.User.UserId));
      claimslist.Add(new Claim("userName", user.Data.User.UserName));
      var roles = JsonSerializer.Serialize(user.Data.User.Roles);
      claimslist.Add(new Claim("roles", roles));
      // foreach (var role in user.Data.User.Roles)
      // {
      //   claimslist.Add(new Claim("roles", role));
      // }
      
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claimslist),
        // Subject = new ClaimsIdentity(
        //   new[] {
        //     new Claim("systemId", user.Data.User.SystemId),
        //     new Claim("userId", user.Data.User.UserId),
        //     new Claim("userName", user.Data.User.UserName)
        //   }
        // ),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }



    [Route("logout")]
    public async Task<IActionResult> Logout()
    {
      // Clear the existing external cookie to ensure a clean login process
      await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
      return View("Logout");
    }


  }
}