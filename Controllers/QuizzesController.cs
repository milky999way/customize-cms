using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon;
using Amazon.CloudFront.Model;
using Amazon.S3;
using Amazon.S3.Transfer;
using xxx.Models;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using JsonDiffer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace xxx.Controllers
{
  public class QuizzesController : Controller
  {
    private readonly IHttpClientFactory _clientFactory;
    private readonly IConfiguration _config;
    private static IAmazonS3 s3Client;
    
    public QuizzesController(IHttpClientFactory clientFactory, IConfiguration config)
		{
			_clientFactory = clientFactory;
      _config = config;
		}


    [Authorize]
    public async Task<ActionResult<List<Quiz>>> Index(QueryFilter queryFilter)
    {
      Response.Headers.Add("X-Total-Count", "10");
      
      var request = new HttpRequestMessage(HttpMethod.Get,
						"https://rc-xxx.aws.xxx.com/quiz-data?_limit=" + queryFilter.End + "&_sort=" + queryFilter.Sort + ":" + queryFilter.Order + "&_start=" + queryFilter.Start);
      var liveRequest = new HttpRequestMessage(HttpMethod.Get,
						"https://xxx.aws.xxx.com/quiz-data?_limit=" + queryFilter.End + "&_sort=" + queryFilter.Sort + ":" + queryFilter.Order + "&_start=" + queryFilter.Start);

			var client = _clientFactory.CreateClient();
			var response = await client.SendAsync(request);
			var liveResponse = await client.SendAsync(liveRequest);
			if (response.IsSuccessStatusCode)
			{
				// Json 데이터를 C# 개체로 deserialize + 프로퍼티 대/소문자 구분(https://docs.microsoft.com/ko-kr/dotnet/standard/serialization/system-text-json-how-to#case-insensitive-property-matching)
				// response Status: 200 OK
				using var responseStream = await response.Content.ReadAsStreamAsync();
				using var liveResponseStream = await liveResponse.Content.ReadAsStreamAsync();
				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				};
				var temps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<Quiz>>(responseStream, options);
				var liveTemps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<Quiz>>(liveResponseStream, options);
				if (liveTemps.Count < 1)
				{
					// live에 데이터가 아예 없으면 rc 그대로 리턴(DataSync == 전부 false(default)값)
					return temps;
				}
				else
				{
					var compareResult = temps.Union(liveTemps).Select(x => x.Index).Distinct().ToDictionary(x => x, x => "-");
					temps.ForEach(x =>
					{
						var index = x.Index;
						var result = liveTemps.FirstOrDefault(y => y.Index == index);
						if (result != null)
						{
							// Id 필드는 제외하고 비교
							var rcObj = JToken.FromObject(x);
							var liveObj = JToken.FromObject(result);
							removeFields(rcObj, new string[] { "Id" });
							removeFields(liveObj, new string[] { "Id" });
							var compare = JsonDifferentiator.Differentiate(rcObj, liveObj);
							if (compare != null)
							{
								compareResult[index] = "*"; // rc-live 다를때
								foreach (var temp in temps)
								{
									if (temp.Index == index)
									{
										temp.DataSync = false;
									}
								}
							}
							else
							{
								compareResult[index] = "="; // rc-live 같을때
								foreach (var temp in temps)
								{
									if (temp.Index == index)
									{
										temp.DataSync = true;
									}
								}
							}
						}
						else
						{
							compareResult[index] = "+"; // live에 없을때
						}
					});
					foreach (var c in compareResult)
					{
						Console.WriteLine($"Index: {c.Key}, rc/live: {c.Value}");
					}
					return temps;
				}
			}
      else
			{
				return BadRequest();
			}
    }
    private void removeFields(JToken token, string[] fields)
		{
			JContainer container = token as JContainer;
			if (container == null) return;
			List<JToken> removeList = new List<JToken>();
			foreach (JToken el in container.Children())
			{
				JProperty p = el as JProperty;
				if (p != null && fields.Contains(p.Name))
				{
					removeList.Add(el);
				}
				removeFields(el, fields);
			}
			foreach (JToken el in removeList)
			{
				el.Remove();
			}
		}


    [Authorize]
		[HttpGet("api/[controller]/{id}")]
		public async Task<ActionResult<Quiz>> Index(int id)
		{
			// xxx에 item을 가져오려면 HttpMethod.Get
			var request = new HttpRequestMessage(HttpMethod.Get,
						"https://rc-xxx.aws.xxx.com/quiz-data/" + id);

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
				var temp = await System.Text.Json.JsonSerializer.DeserializeAsync<Quiz>(responseStream, options);
				return temp;
			}
			else
			{
				// response Status: 400 BadRequest
				return BadRequest();
			}
		}


    [Authorize]
		[HttpPost("api/[controller]")]
		// 입력받는 값을 C# 개체로 받음(DeSerialize) <-- [FromBody]
		public async Task<ActionResult<Quiz>> Create(int id, [FromBody] Quiz quiz)
		{
			// C# 개체를 Json 데이터로 serialize + CamelCaseProperty
			var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
			var quizData = Newtonsoft.Json.JsonConvert.SerializeObject(quiz, settings);

			// xxx에 create하려면 HttpMethod.Post
			var request = new HttpRequestMessage(HttpMethod.Post,
						"https://rc-xxx.aws.xxx.com/quiz-data");

			request.Headers.Add("Accept", "application/json");
			request.Content = new StringContent(
				quizData,
				System.Text.Encoding.UTF8,
				"application/json"
			);
			var client = _clientFactory.CreateClient();
			var response = await client.SendAsync(request);
			if (response.IsSuccessStatusCode)
			{
				// response Status: 200 OK
				return Ok(new { id = quiz.Id });
			}
			else
			{
				// response Status: 400 BadRequest
				return BadRequest();
			}
		}


    [Authorize]
		[HttpPut("api/[controller]/{id}")]
		public async Task<ActionResult<Quiz>> Update(int id, [FromBody] Quiz quiz)
		{
			// C# 개체를 Json 데이터로 serialize + CamelCaseProperty
			var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
			var quizData = Newtonsoft.Json.JsonConvert.SerializeObject(quiz, settings);

			// xxx에 update하려면 HttpMethod.Put
			var request = new HttpRequestMessage(HttpMethod.Put,
						"https://rc-xxx.aws.xxx.com/quiz-data/" + id);

			request.Headers.Add("Accept", "application/json");
			request.Content = new StringContent(
				quizData,
				System.Text.Encoding.UTF8,
				"application/json"
			);

			var client = _clientFactory.CreateClient();
			var response = await client.SendAsync(request);

			if (response.IsSuccessStatusCode)
			{
				// response Status: 200 OK
				return Ok(new { id = quiz.Id });
			}
			else
			{
				// response Status: 400 BadRequest
				return BadRequest();
			}
		}


    [Authorize]
		[HttpDelete("api/[controller]/{id}")]
		public async Task<ActionResult<Quiz>> Delete(int id)
		{
			// xxx에 delete하려면 HttpMethod.Delete
			var rcRequest = new HttpRequestMessage(HttpMethod.Delete,
						"https://rc-xxx.aws.xxx.com/quiz-data/" + id);

			// live-xxx (list) 조회
			var liveRequest = new HttpRequestMessage(HttpMethod.Get,
						"https://xxx.aws.xxx.com/quiz-data");

			var client = _clientFactory.CreateClient();
			var rcResponse = await client.SendAsync(rcRequest);
			var liveResponse = await client.SendAsync(liveRequest);

			if (rcResponse.IsSuccessStatusCode)
			{
				// response Status: 200 OK
				using var rcResponseStream = await rcResponse.Content.ReadAsStreamAsync();
				using var liveResponseStream = await liveResponse.Content.ReadAsStreamAsync();
				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true,
				};
				var temp = await System.Text.Json.JsonSerializer.DeserializeAsync<Quiz>(rcResponseStream, options);
				var liveTemps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<Quiz>>(liveResponseStream, options);
				foreach (var liveTemp in liveTemps)
				{
					if (liveTemp.Index == temp.Index)
					{
						var request = new HttpRequestMessage(HttpMethod.Delete,
								"https://xxx.aws.xxx.com/quiz-data/" + liveTemp.Id);
						var responseLive = await client.SendAsync(request);
					}
				}
				return temp;
			}
			else
			{
				// response Status: 400 BadRequest
				return BadRequest();
			}
		}


    // 구글 드라이브 사용을 위한 팝업이 열리면 구글 드라이브의 각 퀴즈별 폴더 리스트를 반환
		[HttpGet("api/[controller]/[action]")]
		public List<GoogleDriveFolderEntry> UseGoogleDrive()
		{
			string[] scopes = new string[] {
				DriveService.Scope.Drive,
				DriveService.Scope.DriveFile
			};

			var keyFilePath = @"xxx-xxx-com-19f035ca154a.json";
			var stream = new FileStream(keyFilePath, FileMode.Open, FileAccess.Read);
			var credential = GoogleCredential.FromStream(stream);
			credential = credential.CreateScoped(scopes);

			// Create Drive API driveService.
			var driveService = new DriveService(new BaseClientService.Initializer()
			{
				HttpClientInitializer = credential,
				ApplicationName = "Google Drive API Demo",
			});

			// Define parameters of request.
			FilesResource.ListRequest listRequest = driveService.Files.List();
			listRequest.Fields = "nextPageToken, files(id, name, kind, trashed, parents, md5Checksum, mimeType, size)";
			listRequest.PageSize = 1000;
			listRequest.Corpora = "allDrives";
			listRequest.IncludeItemsFromAllDrives = true;
			listRequest.IncludeTeamDriveItems = true;
			listRequest.SupportsAllDrives = true;
			listRequest.SupportsTeamDrives = true;
			IList<Google.Apis.Drive.v3.Data.File> files = listRequest.Execute().Files; // List files.

			// 구글 드라이브 폴더 모델 인스턴스
			var googleDriveFolderEntrys = new List<GoogleDriveFolderEntry>();

			var id = "";
			if (files != null && files.Count > 0)
			{
				// 폴더 이름이 프로젝트와 매치되는 id를 찾아 id 변수에 할당
				foreach (var file in files)
				{
					if (file.Name == "quiz")
					{
						if (file.MimeType == "application/vnd.google-apps.folder")
						{
							id = file.Id;
						}
					}
				}
				if (!string.IsNullOrEmpty(id))
				{
					foreach (var file in files)
					{
						if (file.Parents != null && file.Parents[0] == id && file.Trashed == false)
						{
							// googleDriveFolderEntrys 모델(인스턴스)에  구글드라이브 하위의 폴더 목록 추가(ex- 04, 05, 06...회차 관련 폴더)
							googleDriveFolderEntrys.Add(new GoogleDriveFolderEntry()
							{
								Id = file.Id,
								Name = file.Name
							});
						}
					}
				}
			}
			else
			{
				Console.WriteLine("No files found.");
			}
			return googleDriveFolderEntrys;
		}


    // 에피소드 (회차)폴더 선택시에 폴더안에 정형화된 폴더를(Dictionary 타입) 찾아 그 아래 파일 리스트를 반환
		[HttpGet("api/[controller]/[action]/{selectId}/{fieldId}")]
		public List<GoogleDriveFileEntry> SelectGoogleDrive(string selectId, string fieldId)
		{
			string[] scopes = new string[] {
				DriveService.Scope.Drive,
				DriveService.Scope.DriveFile
			};

			var keyFilePath = @"xxx-xxx-com-19f035ca154a.json";
			var stream = new FileStream(keyFilePath, FileMode.Open, FileAccess.Read);
			var credential = GoogleCredential.FromStream(stream);
			credential = credential.CreateScoped(scopes);

			// Create Drive API driveService.
			var driveService = new DriveService(new BaseClientService.Initializer()
			{
				HttpClientInitializer = credential,
				ApplicationName = "Google Drive API Demo",
			});

			// PageSize 제한 관련 수정
			// 참조: https://stackoverflow.com/questions/41572228/how-to-list-of-more-than-1000-records-from-google-drive-api-v3-in-c-sharp
			List<Google.Apis.Drive.v3.Data.File> allFiles = new List<Google.Apis.Drive.v3.Data.File>();
			Google.Apis.Drive.v3.Data.FileList result = null;
			while (true)
			{
				if (result != null && string.IsNullOrWhiteSpace(result.NextPageToken))
					break;

				FilesResource.ListRequest listRequest = driveService.Files.List();
				listRequest.Fields = "nextPageToken, files(id, name, kind, trashed, parents, md5Checksum, mimeType, size, thumbnailLink)";
				listRequest.PageSize = 1000;
				listRequest.Corpora = "allDrives";
				listRequest.IncludeItemsFromAllDrives = true;
				listRequest.IncludeTeamDriveItems = true;
				listRequest.SupportsAllDrives = true;
				listRequest.SupportsTeamDrives = true;
				if (result != null)
					listRequest.PageToken = result.NextPageToken;

				result = listRequest.Execute();
				allFiles.AddRange(result.Files);
			}

			// 구글 드라이브 파일 모델 인스턴스
			var googleDriveFileEntrys = new List<GoogleDriveFileEntry>();
			// 각 회차안에 정형화된 폴더 구조
			var folders = new Dictionary<string, string>
			{
				{"en", ""},
				{"ja", ""},
				{"ko", ""},
				{"img", ""}
			};

			if (allFiles != null && allFiles.Count > 0)
			{
				foreach (var file in allFiles)
				{
					// 현재 선택된 회차 폴더
					if (file.Parents != null && file.Parents[0] == selectId && file.Trashed == false && file.Name == fieldId)
					{
						var fileName = file.Name;
						var fileId = file.Id;
						// 현재 선택된 회차 폴더 아래에서 고정적으로 구분되어 있는 폴더 키값 세팅(en, ja, ko, img)
						foreach (var key in folders.Keys)
						{
							if (key == fileName)
							{
								folders[key] = fileId;
								break;
							}
						}
					}
				}
				foreach (var folderName in folders.Keys)
				{
					var folderId = folders[folderName];
					foreach (var file in allFiles)
					{
						// (en, ja, ko, img) 폴더별로 찾아 안에 내용 출력
						if (file.Parents != null && file.Parents[0] == folderId && file.Trashed == false)
						{
							googleDriveFileEntrys.Add(new GoogleDriveFileEntry()
							{
								ImageId = file.Id,
								ImageFolder = folderName,
								ImagePath = file.ThumbnailLink,
								ImageName = file.Name
							});
						}
					}
				}
			}
			return googleDriveFileEntrys;
		}


    // 체크한 (요청)목록을 받아서 구글 드라이브에서 xxx로 다운로드
		[HttpPost("api/[controller]/[action]/{folderId}/{langId}")]
		public List<string> AddFileListGoogleDrive(string folderId, string langId, [FromBody] string[] fileIds)
		{
			// 지역변수는 소문자로 시작
			string[] scopes = new string[] {
				DriveService.Scope.Drive,
				DriveService.Scope.DriveFile
			};

			var keyFilePath = @"xxx-xxx-com-19f035ca154a.json";
			var stream = new FileStream(keyFilePath, FileMode.Open, FileAccess.Read);
			var credential = GoogleCredential.FromStream(stream);
			credential = credential.CreateScoped(scopes);

			var driveService = new DriveService(new BaseClientService.Initializer()
			{
				HttpClientInitializer = credential,
				ApplicationName = "Google Drive API Demo",
			});

			try
			{
				List<string> arrList = new List<string>();
				foreach (var fileId in fileIds)
				{
					FilesResource.GetRequest getRequest = driveService.Files.Get(fileId);
					getRequest.Fields = "id, name, kind, trashed, parents, md5Checksum, mimeType, size";
					getRequest.SupportsAllDrives = true;
					getRequest.SupportsTeamDrives = true;
					Google.Apis.Drive.v3.Data.File file = getRequest.Execute();

					// 구글 드라이브에서 가져온 폴더 구조 생성(세팅)
					string wwwRoot = @"wwwroot";
					string folderPathString = System.IO.Path.Combine(wwwRoot, "GoogleDriveEntry", "quiz", folderId, langId);
					System.IO.Directory.CreateDirectory(folderPathString);

					// 구글 드라이브에서 가져온 파일 생성(세팅)
					string filePathString = System.IO.Path.Combine(wwwRoot, "GoogleDriveEntry", "quiz", folderId, langId, file.Name);
					DownloadFile(driveService, file, filePathString);

					// S3 폴더(파일) 업로드
					S3UploadFile(folderPathString);

					// return(response) 설정
					var imgPathString = filePathString.Replace(wwwRoot + "/GoogleDriveEntry/", "https://static.xxx.com.com/xxx/upload/");
					arrList.Add(imgPathString);
				}
				return arrList;
			}
			catch (Exception e)
			{
				Console.WriteLine("An error occurred: " + e.Message);
				// response Status: 400 BadRequest
				return null;
			}
		}
		private static void DownloadFile(Google.Apis.Drive.v3.DriveService service, Google.Apis.Drive.v3.Data.File file, string saveTo)
		{
			var request = service.Files.Get(file.Id);
			var stream = new System.IO.MemoryStream();
			request.MediaDownloader.ProgressChanged += (Google.Apis.Download.IDownloadProgress progress) =>
			{
				switch (progress.Status)
				{
					case Google.Apis.Download.DownloadStatus.Downloading:
          {
            Console.WriteLine(progress.BytesDownloaded);
            break;
          }
					case Google.Apis.Download.DownloadStatus.Completed:
          {
            Console.WriteLine("xxx : Download complete.");
            SaveStream(stream, saveTo);
            break;
          }
					case Google.Apis.Download.DownloadStatus.Failed:
          {
            Console.WriteLine("xxx : Download failed.");
            break;
          }
				}
			};
			request.Download(stream);
		}
		private static void SaveStream(System.IO.MemoryStream stream, string saveTo)
		{
			using (System.IO.FileStream file = new System.IO.FileStream(saveTo, System.IO.FileMode.Create, System.IO.FileAccess.Write))
			{
				stream.WriteTo(file);
			}
		}
		public void S3UploadFile(string folderPath)
		{
			var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
			var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
			var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
			var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
			var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

			// s3Client = new AmazonS3Client(awsAccessKey, awsSecretKey, regionEndpoint);
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
				var quizFolder = folderPath.Replace("wwwroot/GoogleDriveEntry/quiz", "");
				await directoryTransferUtility.UploadDirectoryAsync(folderPath, awsBucketName + "/static.xxx.com.com/xxx/upload/quiz" + quizFolder);
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


    // 이 메소드에서 (xxx) rc -> live로 데이터 Create 또는 Update (DataSync(true) 포함하여 리턴)
		[HttpPost("api/[controller]/[action]/{recordId}")]
		public async Task<ActionResult<Quiz>> PublishQuiz(int recordId)
		{
			// rc-xxx (item) 조회
			var rcRequest = new HttpRequestMessage(HttpMethod.Get,
						"https://rc-xxx.aws.xxx.com/quiz-data/" + recordId);

			// live-xxx (list) 조회
			var liveRequest = new HttpRequestMessage(HttpMethod.Get,
						"https://xxx.aws.xxx.com/quiz-data");

			var client = _clientFactory.CreateClient();
			var rcResponse = await client.SendAsync(rcRequest);
			var liveResponse = await client.SendAsync(liveRequest);

			using var rcResponseStream = await rcResponse.Content.ReadAsStreamAsync();
			using var liveResponseStream = await liveResponse.Content.ReadAsStreamAsync();
			var options = new JsonSerializerOptions
			{
				PropertyNameCaseInsensitive = true,
			};
			var temp = await System.Text.Json.JsonSerializer.DeserializeAsync<Quiz>(rcResponseStream, options);
			var settings = new Newtonsoft.Json.JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
			var quizData = Newtonsoft.Json.JsonConvert.SerializeObject(temp, settings);

			var liveTemps = await System.Text.Json.JsonSerializer.DeserializeAsync<List<Quiz>>(liveResponseStream, options);
			foreach (var liveTemp in liveTemps)
			{
				if (liveTemp.Index == temp.Index) // live에 rc의 index가 존재한다면 HttpMethod.Put
				{
					var request = new HttpRequestMessage(HttpMethod.Put,
							"https://xxx.aws.xxx.com/quiz-data/" + liveTemp.Id);
					request.Headers.Add("Accept", "application/json");
					request.Content = new StringContent(
						quizData,
						System.Text.Encoding.UTF8,
						"application/json"
					);
					var responseLive = await client.SendAsync(request);
					temp.DataSync = true;
				}
				else // live에 rc의 index가 존재하지않는다면 HttpMethod.Post
				{
					var request = new HttpRequestMessage(HttpMethod.Post,
							"https://xxx.aws.xxx.com/quiz-data");
					request.Headers.Add("Accept", "application/json");
					request.Content = new StringContent(
						quizData,
						System.Text.Encoding.UTF8,
						"application/json"
					);
					var responseLive = await client.SendAsync(request);
				}
			}
			return temp;
		}





    [HttpGet("api/[controller]/[action]/{invalidationIdWeb}/{invalidationIdS3}")]
    public bool InvalidationCheckRc(string invalidationIdWeb, string invalidationIdS3)
    {
			var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
			var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
			var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
			var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
			var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

			var client = awsAccessKey == "" && awsSecretKey == "" ? new Amazon.CloudFront.AmazonCloudFrontClient() : new Amazon.CloudFront.AmazonCloudFrontClient(awsAccessKey, awsSecretKey, regionEndpoint);

      if (invalidationIdWeb == "none" && invalidationIdS3 == "none")
      {
        var invalidationsWeb = client.ListInvalidationsAsync(new ListInvalidationsRequest("E38QGMBLJ5K6Z1"));
        var invalidationsS3 = client.ListInvalidationsAsync(new ListInvalidationsRequest("E2GXZ0TN96H0M8"));
        if (invalidationsWeb.Result.InvalidationList.Items[0].Status == "InProgress" && invalidationsS3.Result.InvalidationList.Items[0].Status == "InProgress")
        {
          return true;
        }
        return false;
      }
      else
      {
        var invalidationResponseWeb = client.GetInvalidationAsync(new GetInvalidationRequest("E38QGMBLJ5K6Z1", invalidationIdWeb));
        var invalidationResponseS3 = client.GetInvalidationAsync(new GetInvalidationRequest("E2GXZ0TN96H0M8", invalidationIdS3));
        if (invalidationResponseWeb.Result.Invalidation.Status == "InProgress" && invalidationResponseS3.Result.Invalidation.Status == "InProgress")
        {
          return true;
        }
        return false;
      }
    }

    [HttpGet("api/[controller]/[action]/{invalidationIdWeb}/{invalidationIdS3}")]
    public bool InvalidationCheckLive(string invalidationIdWeb, string invalidationIdS3)
    {
			var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
			var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
			var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
			var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
			var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

			var client = awsAccessKey == "" && awsSecretKey == "" ? new Amazon.CloudFront.AmazonCloudFrontClient() : new Amazon.CloudFront.AmazonCloudFrontClient(awsAccessKey, awsSecretKey, regionEndpoint);

			if (invalidationIdWeb == "none" && invalidationIdS3 == "none")
      {
        var invalidationsWeb = client.ListInvalidationsAsync(new ListInvalidationsRequest("E2GG4BBFFB82U9"));
        var invalidationsS3 = client.ListInvalidationsAsync(new ListInvalidationsRequest("E2GXZ0TN96H0M8"));
        if (invalidationsWeb.Result.InvalidationList.Items[0].Status == "InProgress" && invalidationsS3.Result.InvalidationList.Items[0].Status == "InProgress")
        {
          return true;
        }
        return false;
      }
      else
      {
        var invalidationResponseWeb = client.GetInvalidationAsync(new GetInvalidationRequest("E2GG4BBFFB82U9", invalidationIdWeb));
        var invalidationResponseS3 = client.GetInvalidationAsync(new GetInvalidationRequest("E2GXZ0TN96H0M8", invalidationIdS3));
        if (invalidationResponseWeb.Result.Invalidation.Status == "InProgress" && invalidationResponseS3.Result.Invalidation.Status == "InProgress")
        {
          return true;
        }
        return false;
      }
    }

		[HttpPost("api/[controller]/[action]/{target}")]
		public string InvalidationCache(string target)
		{
			var awsRegion = _config["xxx:AWS_S3_Bucket_Region"];
			var awsBucketName = _config["xxx:AWS_S3_Bucket_Name"];
			var awsAccessKey = _config["xxx:AWS_S3_AccessKey"];
			var awsSecretKey = _config["xxx:AWS_S3_SecretKey"];
			var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);

			if (target == "live")
			{
				var liveWebProgress = CreateInvalidationId(awsAccessKey, awsSecretKey, regionEndpoint, "E2GG4BBFFB82U9", "/episode*", "(LIVE)front web");
				var liveS3Progress = CreateInvalidationId(awsAccessKey, awsSecretKey, regionEndpoint, "E2GXZ0TN96H0M8", "/episode*", "(LIVE)static S3");
        var combineIdLive = liveWebProgress+"/"+liveS3Progress;
        var checkParamsLive = Newtonsoft.Json.JsonConvert.SerializeObject(combineIdLive);
        return checkParamsLive;
			}
			else
			{
				var rcWebProgress = CreateInvalidationId(awsAccessKey, awsSecretKey, regionEndpoint, "E38QGMBLJ5K6Z1", "/episode*", "(RC)front web");
				var rcS3Progress = CreateInvalidationId(awsAccessKey, awsSecretKey, regionEndpoint, "E2GXZ0TN96H0M8", "/rc-episode*", "(RC)static S3");
        var combineIdRc = rcWebProgress+"/"+rcS3Progress;
        var checkParamsRc = Newtonsoft.Json.JsonConvert.SerializeObject(combineIdRc);
        return checkParamsRc;
			}
		}
		private string CreateInvalidationId(string awsAccessKey, string awsSecretKey, RegionEndpoint regionEndpoint, string dId, string oPaths, string execute)
		{
			var client = awsAccessKey == "" && awsSecretKey == "" ? new Amazon.CloudFront.AmazonCloudFrontClient() : new Amazon.CloudFront.AmazonCloudFrontClient(awsAccessKey, awsSecretKey, regionEndpoint);
			var request = new CreateInvalidationRequest();
			request.DistributionId = dId;
			request.InvalidationBatch = new InvalidationBatch
			{
				CallerReference = DateTime.Now.Ticks.ToString(),
				Paths = new Paths
				{
					Items = new List<string>(new string[] { oPaths }),
					Quantity = 1
				}
			};
			var response = client.CreateInvalidationAsync(request);
			var invalidationId = response.Result.Invalidation.Id;
      if (!String.IsNullOrEmpty(invalidationId))
      {
        return invalidationId;
      }
      return null;
		}





  }
}