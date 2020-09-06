using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ZoomFeature.API.Models
{
    public class Request
    {
        public string Token { get; set; }
        public MeetingRequest MeetingRequest { get; set; }
    }
    public class MeetingRequest
    {
        public string topic { get; set; }
        public int type { get; set; } = 1;
        public string password { get; set; }
        public string agenda { get; set; }
        public Settings settings { get; set; }
    }

    public class Settings
    {
        public bool host_video { get; set; } = true;
        public bool participant_video { get; set; } = true;
        public bool join_before_host { get; set; } = true;
        public bool mute_upon_entry { get; set; } = true;
        public int approval_type { get; set; } = 0;
    }
}