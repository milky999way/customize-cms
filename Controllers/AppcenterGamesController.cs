using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using xxx.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace xxx.Controllers
{
  public class AppcenterGamesController : Controller
  {
    private readonly IHttpClientFactory _clientFactory; // readonly 변경이 안됨(공통자원은 건드리면 안됨)
    private readonly IConfiguration _config; // 구글 드라이브 & AWS S3
    private static IAmazonS3 s3Client;

    // 생성자
    public AppcenterGamesController(IHttpClientFactory clientFactory, IConfiguration config)
    {
      _clientFactory = clientFactory;
      _config = config;
    }



    public async Task<ActionResult<List<AppcenterGame>>> Index(QueryFilter queryFilter)
    {
      Response.Headers.Add("X-Total-Count", "10");

      // xxx에 list를 가져오려면 HttpMethod.Get
      var request = new HttpRequestMessage(HttpMethod.Get,
            "http://localhost:1337/appcenter-game-data?_limit=" + queryFilter.End + "&_sort=" + queryFilter.Sort + ":" + queryFilter.Order + "&_start=" + queryFilter.Start);

      //var liveRequest = new HttpRequestMessage(HttpMethod.Get,
      //      "https://xxx.aws.xxx.com/appcenter-game-data?_limit=" + queryFilter.End + "&_sort=" + queryFilter.Sort + ":" + queryFilter.Order + "&_start=" + queryFilter.Start);

      var client = _clientFactory.CreateClient();
      var response = await client.SendAsync(request);

      if (response.IsSuccessStatusCode)
      {
        using var responseStream = await response.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true
        };
        var temps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<AppcenterGame>>(responseStream, options);
        Console.WriteLine(temps);
        return temps;
      }
      else
      {
        return BadRequest();
      }
    }



    [HttpGet("api/[controller]/{id}")]
    public async Task<ActionResult<AppcenterGame>> Index(int id)
    {
      //var temps = new AppcenterGame
      //{
      //  Id = 4,
      //  App = "Playstead",
      //  Name = "Playstead",
      //  Icon = "Playstead"
      //};
      //return temps;
      // xxx에 item을 가져오려면 HttpMethod.Get
      var request = new HttpRequestMessage(HttpMethod.Get,
            "http://localhost:1337/appcenter-game-data/" + id);

      var client = _clientFactory.CreateClient();
      var response = await client.SendAsync(request);
      if (response.IsSuccessStatusCode)
      {
        // response Status: 200 OK
        using var responseStream = await response.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true,
        };
        var temp = await System.Text.Json.JsonSerializer.DeserializeAsync<AppcenterGame>(responseStream, options);
        return temp;
      }
      else
      {
        // response Status: 400 BadRequest
        return BadRequest();
      }
    }



    [HttpPost("api/[controller]")]
    public async Task<ActionResult<AppcenterGame>> Create(int id, [FromBody] AppcenterGame appcenterGame)
    {
      // C# 개체를 Json 데이터로 serialize + CamelCaseProperty
      var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
      var appcenterGameData = Newtonsoft.Json.JsonConvert.SerializeObject(appcenterGame, settings);

      // xxx에 create하려면 HttpMethod.Post
      var request = new HttpRequestMessage(HttpMethod.Post,
            "http://localhost:1337/appcenter-game-data");

			request.Headers.Add("Accept", "application/json");
			request.Content = new StringContent(
				appcenterGameData,
				System.Text.Encoding.UTF8,
				"application/json"
			);
			var client = _clientFactory.CreateClient();
			var response = await client.SendAsync(request);
			if (response.IsSuccessStatusCode)
			{
				// response Status: 200 OK
				return Ok(new { id = appcenterGame.Id });
			}
			else
			{
				// response Status: 400 BadRequest
				return BadRequest();
			}
    }



    [HttpPut("api/[controller]/{id}")]
    public async Task<ActionResult<AppcenterGame>> Update(int id, [FromBody] AppcenterGame appcenterGame)
    {
      // C# 개체를 Json 데이터로 serialize + CamelCaseProperty
      var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
      var appcenterGameData = Newtonsoft.Json.JsonConvert.SerializeObject(appcenterGame, settings);

      // xxx에 update하려면 HttpMethod.Put
      var request = new HttpRequestMessage(HttpMethod.Put,
            "http://localhost:1337/appcenter-game-data/" + id);

      request.Headers.Add("Accept", "application/json");
      request.Content = new StringContent(
        appcenterGameData,
        System.Text.Encoding.UTF8,
        "application/json"
      );

      var client = _clientFactory.CreateClient();
      var response = await client.SendAsync(request);

      if (response.IsSuccessStatusCode)
      {
        // response Status: 200 OK
        return Ok(new { id = appcenterGame.Id });
      }
      else
      {
        // response Status: 400 BadRequest
        return BadRequest();
      }
    }



    [HttpDelete("api/[controller]/{id}")]
    public async Task<ActionResult<AppcenterGame>> Delete(int id)
    {
      // xxx에 delete하려면 HttpMethod.Delete
      var rcRequest = new HttpRequestMessage(HttpMethod.Delete,
            "http://localhost:1337/appcenter-game-data/" + id);

      var client = _clientFactory.CreateClient();
      var rcResponse = await client.SendAsync(rcRequest);
      //var liveResponse = await client.SendAsync(liveRequest);

      if (rcResponse.IsSuccessStatusCode)
      {
        // response Status: 200 OK
        using var rcResponseStream = await rcResponse.Content.ReadAsStreamAsync();
        //using var liveResponseStream = await liveResponse.Content.ReadAsStreamAsync();
        var options = new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true,
        };
        var temp = await System.Text.Json.JsonSerializer.DeserializeAsync<AppcenterGame>(rcResponseStream, options);
        //var liveTemps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<Episode>>(liveResponseStream, options);
        //foreach (var liveTemp in liveTemps)
        //{
        //  if (liveTemp.Index == temp.Index)
        //  {
        //    var request = new HttpRequestMessage(HttpMethod.Delete,
        //        "https://xxx.aws.xxx.com/episode-data/" + liveTemp.Id);
        //    var responseLive = await client.SendAsync(request);
        //  }
        //}
        return temp;
      }
      else
      {
        // response Status: 400 BadRequest
        return BadRequest();
      }
    }



    [HttpGet("api/[controller]/[action]")]
    public async Task<ActionResult<List<S3AppbuildEntry>>> UseS3Appbuild()
    {
      var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
      var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
      var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
      var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
      var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

      if (awsAccessKey == "" && awsSecretKey == "")
      {
        s3Client = new AmazonS3Client(regionEndpoint);
      }
      else
      {
        s3Client = new AmazonS3Client(awsAccessKey, awsSecretKey, regionEndpoint);
      }


      //ReadObjectDataAsync(awsBucketName).Wait();

      //static async Task ReadObjectDataAsync(string bucketName)
      //{
      //  string responseBody = "";
      //  try
      //  {
      //    GetObjectRequest request = new GetObjectRequest
      //    {
      //      BucketName = bucketName,
      //      Key = "static.xxx.com.com/"
      //    };
      //    using (GetObjectResponse response = await s3Client.GetObjectAsync(request))
      //    using (Stream responseStream = response.ResponseStream)
      //    using (StreamReader reader = new StreamReader(responseStream))
      //    {
      //      string title = response.Metadata["x-amz-meta-title"]; // Assume you have "title" as medata added to the object.
      //      string contentType = response.Headers["Content-Type"];
      //      Console.WriteLine("Object metadata, Title: {0}", title);
      //      Console.WriteLine("Content type: {0}", contentType);

      //      responseBody = reader.ReadToEnd(); // Now you process the response body.
      //    }
      //  }
      //  catch (AmazonS3Exception e)
      //  {
      //    // If bucket or object does not exist
      //    Console.WriteLine("Error encountered ***. Message:'{0}' when reading object", e.Message);
      //  }
      //  catch (Exception e)
      //  {
      //    Console.WriteLine("Unknown encountered on server. Message:'{0}' when reading object", e.Message);
      //  }
      //}



      try
      {
        ListObjectsRequest request = new ListObjectsRequest
        {
          BucketName = awsBucketName,
          Prefix = "static.xxx.com.com/peng/js/"
        };

        List<Dictionary<string, string>> listS3Objs = new List<Dictionary<string, string>>();
        var listObjectsResponse = await s3Client.ListObjectsAsync(request);
        foreach (var obj in listObjectsResponse.S3Objects)
        {
          Dictionary<string, string> dicObjInfo = new Dictionary<string, string>();
          dicObjInfo["Bucket"] = obj.BucketName;
          dicObjInfo["Key"] = obj.Key;
          //dicObjInfo["Size"] = Convert.ToString(obj.Size);
          //dicObjInfo["Tag"] = obj.ETag;
          //dicObjInfo["Modified"] = obj.LastModified.ToString("yyyyMMddHHmmss");
          //dicObjInfo["Owner"] = Convert.ToString(obj.Owner);
          //dicObjInfo["StorageClass"] = obj.StorageClass;
          listS3Objs.Add(dicObjInfo);
        }
        string jsonResult = JsonConvert.SerializeObject(listS3Objs);
        return Ok(jsonResult);
      }
      catch (Exception e)
      {
        return StatusCode(500, e.Message);
      }
      //var aa = new List<S3AppbuildEntry>();
      //return aa;
    }



    [HttpPost("api/[controller]/[action]")]
    public async Task<IActionResult> UploadS3AppIcon(List<IFormFile> appIcon)
    {
      //https://docs.microsoft.com/ko-kr/aspnet/core/mvc/models/file-uploads?view=aspnetcore-5.0
      //long size = appIcon.Sum(f => f.Length);

      foreach (var formFile in appIcon)
      {
        if (formFile.Length > 0)
        {
          // 클라이언트(로컬)에서 가져온 폴더 구조 생성(세팅)
          string wwwRoot = @"wwwroot";
          string folderPathString = System.IO.Path.Combine(wwwRoot, "appcenter", "icon");
          System.IO.Directory.CreateDirectory(folderPathString);

          // 클라이언트(로컬)에서 가져온 파일 생성(세팅)
          var filePathString = System.IO.Path.Combine(wwwRoot, "appcenter", "icon", formFile.FileName);
          using (var stream = System.IO.File.Create(filePathString))
          {
            await formFile.CopyToAsync(stream);
          }

          // S3 폴더(파일) 업로드
          S3UploadFile(folderPathString);

          return Ok(new { icon = filePathString.Replace("wwwroot", "http://static.xxx.com.com/xxx/upload") });
        }
      }
      return null;
    }


    [HttpPost("api/[controller]/[action]")]
    public async Task<IActionResult> UploadS3AppBuild(List<IFormFile> appBuild)
    {
      foreach (var formFile in appBuild)
      {
        if (formFile.Length > 0)
        {
          // 클라이언트(로컬)에서 가져온 폴더 구조 생성(세팅)
          string wwwRoot = @"wwwroot";
          string folderPathString = System.IO.Path.Combine(wwwRoot, "appcenter", "build");
          System.IO.Directory.CreateDirectory(folderPathString);

          // 클라이언트(로컬)에서 가져온 파일 생성(세팅)
          var filePathString = System.IO.Path.Combine(wwwRoot, "appcenter", "build", formFile.FileName);
          using (var stream = System.IO.File.Create(filePathString))
          {
            await formFile.CopyToAsync(stream);
          }

          // S3 폴더(파일) 업로드
          S3UploadFile(folderPathString);

          return Ok(new { app = filePathString.Replace("wwwroot", "http://static.xxx.com.com/xxx/upload") });
        }
      }
      return null;
    }



    public void S3UploadFile(string folderPath)
    {
      var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
      var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
      var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
      var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
      var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

      if (awsAccessKey == "" && awsSecretKey == "")
      {
        s3Client = new AmazonS3Client(regionEndpoint);
      }
      else
      {
        s3Client = new AmazonS3Client(awsAccessKey, awsSecretKey, regionEndpoint);
      }
      UploadDirAsync(awsBucketName, folderPath).Wait();
    }
    private async Task UploadDirAsync(string awsBucketName, string folderPath)
    {
      try
      {
        var directoryTransferUtility = new TransferUtility(s3Client);
        //var appcenterIconFolder = folderPath.Replace("wwwroot/Appcenter/icon", "");
        await directoryTransferUtility.UploadDirectoryAsync(folderPath, awsBucketName + "/static.xxx.com.com/xxx/upload/appcenter/icon");
        Console.WriteLine("S3 : Upload statement completed");
      }
      catch (AmazonS3Exception e)
      {
        Console.WriteLine("Error encountered ***. Message:'{0}' when writing an object", e.Message);
      }
      catch (Exception e)
      {
        Console.WriteLine("Unknown encountered on server. Message:'{0}' when writing an object", e.Message);
      }
    }



    [HttpPut("api/[controller]/[action]/{id}")]
    public async Task<ActionResult<AppcenterGame>> SettingHotgame(int id, [FromBody] AppcenterGame appcenterGame)
    {
      Console.WriteLine(id);
      Console.WriteLine(appcenterGame);
      // C# 개체를 Json 데이터로 serialize + CamelCaseProperty
      var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
      var appcenterGameData = Newtonsoft.Json.JsonConvert.SerializeObject(appcenterGame, settings);

      // xxx에 create하려면 HttpMethod.Post
      var request = new HttpRequestMessage(HttpMethod.Put,
            "http://localhost:1337/appcenter-game-data/" + id);

      request.Headers.Add("Accept", "application/json");
      request.Content = new StringContent(
        appcenterGameData,
        System.Text.Encoding.UTF8,
        "application/json"
      );
      var client = _clientFactory.CreateClient();
      var response = await client.SendAsync(request);
      if (response.IsSuccessStatusCode)
      {
        // response Status: 200 OK
        return Ok(new { id = appcenterGame.Id });
      }
      else
      {
        // response Status: 400 BadRequest
        return BadRequest();
      }

      //return "핫게임이 설정되었습니다.";
    }





  }
}
