using System.Collections.Generic;

namespace xxx.Models
{
  public class Quiz
  {
    public int Id { get; set; }
    public int Index { get; set; }
    public string Title { get; set; }
    public bool DataSync { get; set; } // xxx 데이터로는 사용하지않지만, xxx의 rc/live간 데이터를 비교하여 xxx로 return 해주는 field
    public List<Img> Img { get; set; }
    public List<Chapter> Chapter { get; set; }
  }
  public class Chapter
  {
    public string Type { get; set; }
    public string Question { get; set; }
    public List<Answers> Answers { get; set; }
  }
  public class Answers
  {
    public string Answer { get; set; }
  }
}
