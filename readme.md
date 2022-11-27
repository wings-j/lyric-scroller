# lyric-scroller

Display lyrics by scrolling, synchronized with audio.

## Demo

[https://works-wings.oss-cn-hangzhou.aliyuncs.com/music-visualization_shape-of-you/](https://works-wings.oss-cn-hangzhou.aliyuncs.com/music-visualization_shape-of-you/)

## Usage

Install:

```sh
npm install @wings-j/lyric-scroller
```

Example:

```sh
let lyric = new LyricsScroller(audio, text)
document.body.appendChild(lyric.dom)
```

## API

### `new LyricScroller(audio: HTMLAudioElement, lyric: string, { width = '100%', height = '100%', padding = '20px 0', font = 'inherit' } = {})`

Parameters:

- audio: HTMLAudioElement
- lyric: lyric text in format of lrc file
- width: width of the container
- height: height of the container
- padding: gap between the lyric line
- font: font of the lyric
