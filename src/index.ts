/**
 * 歌词滚动
 */
class LyricScroller {
  static transitionDuration = '0.5s'
  static highlightFactor = 2

  public dom: HTMLDivElement
  private audio: HTMLAudioElement
  private lyric: Lyric
  private content: HTMLDivElement
  private lines: HTMLDivElement[]

  /**
   * 构造方法
   * @param audio 音频
   * @param lyric 歌词。LRC格式
   * @param width 宽度
   * @param height 高度
   * @param padding 行内边距
   * @param font 字体
   * @param highlight 当前句放大
   * @param highlightFactor 放大倍数
   */
  constructor(audio: HTMLAudioElement, lyric: string, { width = '100%', height = '100%', padding = '20px 0', font = '' } = {}) {
    this.audio = audio
    this.lyric = new Lyric(lyric)

    this.dom = window.document.createElement('div')
    this.dom.style.position = 'relative'
    this.dom.style.overflow = 'hidden'
    this.dom.style.width = width
    this.dom.style.height = height
    this.dom.style.font = font
    this.dom.style.textAlign = 'center'
    this.dom.style.lineHeight = '1'
    this.dom.style.mask = this.dom.style.webkitMask = 'linear-gradient(180deg, transparent 0%,#FFFFFF 27%,#FFFFFF 73%,transparent 100%)'
    this.content = window.document.createElement('div')
    this.content.style.position = 'relative'
    this.content.style.top = '50%'
    this.content.style.transition = `transform ${LyricScroller.transitionDuration}`
    this.dom.appendChild(this.content)
    this.lines = this.lyric.lines.map(a => {
      let div = window.document.createElement('div')
      div.classList.add('lyric-scroller')
      div.classList.add(a.time.toString())
      div.innerText = a.text
      div.style.padding = padding
      div.style.transform = 'translateY(-50%)'
      div.style.transition = `transform ${LyricScroller.transitionDuration}`

      return div
    })
    this.content.append(...this.lines)
  }

  /**
   * 开始
   */
  play() {
    this.audio.addEventListener('timeupdate', this.handleTimeChange.bind(this))
  }

  /**
   * 暂停
   */
  pause() {
    this.audio.removeEventListener('timeupdate', this.handleTimeChange.bind(this))
  }

  /**
   * 处理时间变更
   */
  handleTimeChange() {
    let time = this.audio.currentTime * 1000
    let target = this.lines.at(-1)
    for (let i = 0; i < this.lyric.lines.length; i++) {
      let line = this.lyric.lines[i]
      if (line.time > time) {
        if (i > 0) {
          target = this.lines[i - 1]
        } else {
          target = this.lines[i]
        }

        break
      }
    }

    if (target) {
      this.content.style.transform = `translateY(${-target.offsetTop}px)`
    }

    this.lines.forEach(a => {
      if (a == target) {
        a.style.transform = `translateY(-50%) scale(${LyricScroller.highlightFactor})`
      } else {
        a.style.transform = 'translateY(-50%)'
      }
    })
  }
}

/**
 * 歌词
 */
class Lyric {
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

export { LyricScroller as LyricsScroller, Lyric as Lyrics }
