using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web.Http;
using ZoomFeature.API.Models;

namespace ZoomFeature.API.Controllers
{
    [RoutePrefix("api/zoomfeature")]
    public class ZoomFeatureController : ApiController
    {
        static readonly char[] _padding = { '=' };
        static readonly string  _apiKey = ""; // your zoom api key
        static readonly string _apiSecret = ""; // your zoom api secret

        [HttpPost]
        [Route("meetings")]
        public async Task<IHttpActionResult> CreateMeeting([FromBody] Request request)
        {

            string userId = string.Empty;

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {request.Token}");
                var response = await client.GetAsync("https://api.zoom.us/v2/users");
                string result = await response.Content.ReadAsStringAsync();
                var userResponse = JsonConvert.DeserializeObject<ZoomUserResponse>(result);
                userId = userResponse.users[0].id;
            }

            using (var client = new HttpClient())
            {
                request.MeetingRequest.settings = new Settings
                {
                    approval_type = 0,
                    host_video = true,
                    join_before_host = true,
                    mute_upon_entry = true,
                    participant_video = true
                };
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {request.Token}");
                var response = await client.PostAsJsonAsync($"https://api.zoom.us/v2/users/{userId}/meetings", request.MeetingRequest);
                string result = await response.Content.ReadAsStringAsync();
                var meetingResponse = JsonConvert.DeserializeObject<MeetingResponse>(result);
                return Ok(meetingResponse);
            }
        }

        [HttpGet]
        [Route("signature/{meetingNumber}/{role}")]
        public async Task<IHttpActionResult> GetSignature(string meetingNumber, string role)
        {
            string ts = (ToTimestamp(DateTime.UtcNow.ToUniversalTime()) - 30000).ToString();
            string signature = GenerateSignature(_apiKey, _apiSecret, meetingNumber, ts, role);
            return Ok(signature);
        }

        private long ToTimestamp(DateTime value)
        {
            long epoch = (value.Ticks - 621355968000000000) / 10000;
            return epoch;
        }

        private string GenerateSignature(string apiKey, string apiSecret, string meetingNumber, string timestamp, string role)
        {
            string message = String.Format("{0}{1}{2}{3}", apiKey, meetingNumber, timestamp, role);
            apiSecret = apiSecret ?? "";
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(apiSecret);
            byte[] messageBytesTest = encoding.GetBytes(message);
            string msgHashPreHmac = System.Convert.ToBase64String(messageBytesTest);
            byte[] messageBytes = encoding.GetBytes(msgHashPreHmac);
            using (var hmacsha256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                string msgHash = System.Convert.ToBase64String(hashmessage);
                string token = String.Format("{0}.{1}.{2}.{3}.{4}", apiKey, meetingNumber, timestamp, role, msgHash);
                var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
                return System.Convert.ToBase64String(tokenBytes).TrimEnd(_padding);
            }
        }
    }
}
