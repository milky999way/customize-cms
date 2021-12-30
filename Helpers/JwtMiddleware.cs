using xxx.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
//using xxx.Services;

namespace xxx.Helpers
{
  public class JwtMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly AppSettings _appSettings;
    private readonly IHttpClientFactory _clientFactory;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings, IHttpClientFactory clientFactory)
    {
      _next = next;
      _appSettings = appSettings.Value;
      _clientFactory = clientFactory;
    }

    //public async Task Invoke(HttpContext context, IUserService userService)
    public async Task Invoke(HttpContext context)
    {
      var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
      if (token != null)
        attachUserToContext(context, token);
      await _next(context);
    }

    //private void attachUserToContext(HttpContext context, IUserService userService, string token)
    private void attachUserToContext(HttpContext context, string token)
    {
      try
      {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false,
          // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
          ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        //var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);
        var systemId = jwtToken.Claims.First(x => x.Type == "systemId").Value;
        var userId = jwtToken.Claims.First(x => x.Type == "userId").Value;
        var userName = jwtToken.Claims.First(x => x.Type == "userName").Value;
        var serializeRoles = jwtToken.Claims.First(x => x.Type == "roles").Value;
        var roles = JsonSerializer.Deserialize<List<string>>(serializeRoles);

        // attach user to context on successful jwt validation
        context.Items["User"] = new xxx.Entities.User { SystemId = systemId, UserId = userId, UserName = userName, Roles = roles };
      }
      catch
      {
        // do nothing if jwt validation fails
        // user is not attached to context so request won't have access to secure routes
        Console.WriteLine("유효하지않은 토큰~");
      }
    }

    //public async Task<ActionResult<LoginInformation>> GetById(string user)
    //{
    //  var request = new HttpRequestMessage(HttpMethod.Get, "https://xxx.xxx.com/api/authenticator/permissionset?userid=" + user);
    //  request.Headers.Add("X-xxx-Authenticator-SystemId", "");
    //  request.Headers.Add("X-xxx-Authenticator-SecretKey", "");
    //  var client = _clientFactory.CreateClient();
    //  var response = await client.SendAsync(request);
    //  if (response.IsSuccessStatusCode)
    //  {
    //    using var responseStream = await response.Content.ReadAsStreamAsync();
    //    var options = new JsonSerializerOptions
    //    {
    //      PropertyNameCaseInsensitive = true
    //    };
    //    var user = await System.Text.Json.JsonSerializer.DeserializeAsync<LoginInformation>(responseStream, options);
    //    return user
    //  }
    //  else
    //  {
    //    return BadRequest();
    //  }
    //}


  }
}
