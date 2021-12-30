using System.Collections.Generic;

namespace xxx.Models
{
  public class Episode
  {
    public int Id { get; set; }
    public int Index { get; set; }
    public string Link { get; set; }
    public string EpNum { get; set; }
    public string EpIndex { get; set; }
    public string DataEvt { get; set; }
    public int Slides { get; set; }
    public string LastSlide { get; set; }
    public bool DataSync { get; set; } // xxx 데이터로는 사용하지않지만, xxx의 rc/live간 데이터를 비교하여 xxx로 return 해주는 field 
    public List<Img> Img { get; set; }
    public List<LanguageItem> LanguageItem { get; set; }
  }
  public class LanguageItem
  {
    public string Lang { get; set; }
    public string Title { get; set; }
    public string Subtitle { get; set; }
    public string LastSlideGameComment { get; set; }
    public string LastSlideGameButton { get; set; }
    public string LastSlideGameSubtext { get; set; }
    public string LastSlideBannerComment { get; set; }
    public string LastSlideBannerButton { get; set; }
    public string LastSlideBannerLink { get; set; }
    public List<Img> Img { get; set; }
  }
  // public class Img
  // {
  //   public string Src { get; set; }
  // }
}