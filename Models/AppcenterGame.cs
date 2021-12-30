using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace xxx.Models
{
  public class AppcenterGame
  {
    public int Id { get; set; }
    public App App { get; set; } // file - S3
    public string Name { get; set; }
    public Icon Icon { get; set; } // file - S3
    public Launching Launching { get; set; }
    public string UpdateDate { get; set; } // Date
    public string Version { get; set; }
    public List<Channel> Channel { get; set; }
    public List<Market> Market { get; set; }
    public List<Build> Build { get; set; }
    public string UpdateInfo { get; set; }
    public string GameInfo { get; set; }
    public Guide Guide { get; set; }
    public Display Display { get; set; }

    public int Index { get; set; }
    public bool HotGame { get; set; }
    public bool StopUsing { get; set; }
  }



  public class App
  {
    public string Source { get; set; }
  }


  public class Icon
  {
    public string Source { get; set; }
  }


  public class Launching
  {
    public string Date { get; set; } // Date
    public bool Enable { get; set; }
  }


  public class Channel
  {
    public string Sns { get; set; }
    public string Link { get; set; }
  }


  public class Market
  {
    public string Locale { get; set; }
    public string Os { get; set; }
    public string Link { get; set; }
  }


  public class Build
  {
    public string Os { get; set; }
    public App App { get; set; } // file - S3
  }


  public class Guide
  {
    public bool Used { get; set; }
    public string AppGuide { get; set; }
  }


  public class Display
  {
    public bool Reserved { get; set; }
    public string ReservedDate { get; set; } // DateTime
  }
}
