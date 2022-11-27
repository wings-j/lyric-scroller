/**
 * 歌词滚动
 */
class LyricsScroller {
  public dom: HTMLDivElement
  public lines: HTMLDivElement[]
  private audio: HTMLAudioElement
  private lyrics: Lyrics

  /**
   * 构造方法
   * @param audio 音频
   * @param lyrics 歌词。LRC格式
   */
  constructor(audio: HTMLAudioElement, lyrics: string) {
    this.audio = audio
    this.lyrics = new Lyrics(lyrics)

    this.dom = document.createElement('div')
    this.lines = this.lyrics.lines.map(a => {
      let div = document.createElement('div')
      div.classList.add('lyric-scroller')
      div.classList.add(a.time.toString())

      return div
    })
    this.dom.append(...this.lines)
  }

  /**
   * 开始
   */
  start() {}
}

/**
 * 歌词
 */
class Lyrics {
  title = ''
  artist = ''
  album = ''
  by = ''
  offset = 0
  lines: { time: number; text: string }[] = []

  /**
   * 构造方法
   * @param text 文本
   */
  constructor(text: string) {
    let statements = text.split('\n')
    for (let i = 0, l = statements.length; i < l; i++) {
      let statement = statements[i]
      if (statement) {
        let timeTagBracket = statement.match(/\[\d+:\d{1,2}\.?\d*\]/)
        if (timeTagBracket) {
          let time = timeTagBracket[0].split(/[\[\]:]/)
          let ms = parseInt(time[1]) * 60 * 1000 + parseFloat(time[2]) * 1000

          let text = statement.split(/\[\d+:\d{1,2}\.?\d*\]/)[1]
          text = text.replace(/\n|\r/g, '')

          this.lines.push({ time: ms, text })
        } else {
          let arTemp = statement.match(/\[ar:.*\]/)
          if (arTemp) {
            this.artist = arTemp[0].split(/[\[:\]]/)[2]
          }
          let tiTemp = statement.match(/\[ti:.*\]/)
          if (tiTemp) {
            this.title = tiTemp[0].split(/[\[:\]]/)[2]
          }
          let alTemp = statement.match(/\[al:.*\]/)
          if (alTemp) {
            this.album = alTemp[0].split(/[\[:\]]/)[2]
          }
          let byTemp = statement.match(/\[by:.*\]/)
          if (byTemp) {
            this.by = byTemp[0].split(/[\[:\]]/)[2]
          }
          let offsetTemp = statement.match(/\[offset:.*\]/)
          if (offsetTemp) {
            this.offset = parseInt(offsetTemp[0].split(/[\[:\]]/)[2])
          }
        }
      }
    }
  }
}

export { LyricsScroller, Lyrics }
