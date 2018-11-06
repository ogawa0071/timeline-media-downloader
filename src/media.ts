import axios from 'axios'
import * as fs from 'fs'
import * as process from 'process'

interface Media {
  id: number
  id_str: string
  indices: number[]
  media_url: string
  media_url_https: string
  url: string
  display_url: string
  expanded_url: string
  type: string
  sizes: Sizes
  video_info: VideoInfo
}

interface Sizes {
  thumb: any
  large: any
  medium: any
  small: any
}

interface VideoInfo {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variants[]
}

interface Variants {
  bitrate?: number
  content_type: string
  url: string
}

const media = async (tweet: any) => {
  // const mediaArray: Media[] = tweet.extended_entities.media
  const mediaArray: Media[] = tweet.extended_tweet && tweet.extended_tweet.extended_entities && tweet.extended_tweet.extended_entities.media ? tweet.extended_tweet.extended_entities.media : tweet.extended_entities.media
  const screen_name = tweet.user.screen_name

  try {
    fs.readdirSync(`${process.cwd()}/${screen_name}`)
  } catch {
    fs.mkdirSync(`${process.cwd()}/${screen_name}`)
  }

  await Promise.all(
    mediaArray.map(async media => {
      const url = media.media_url_https
      const name = /(.+)(\/)(.+?)((\?)(.*)|$)/.exec(url)
      if (name === null) {
        throw new Error()
      }

      const response = await axios.get(url, {
        responseType: 'stream',
      })
      response.data.pipe(fs.createWriteStream(`${process.cwd()}/${screen_name}/${tweet.id_str}-${name[3]}`))

      if (media.type === 'video' || media.type === 'animated_gif') {
        const video = media.video_info

        const maxBitrateVideo = video.variants.reduce((variant, nextVariant) => {
          if (variant.bitrate && nextVariant.bitrate) {
            if (variant.bitrate > nextVariant.bitrate) {
              return variant
            } else {
              return nextVariant
            }
          }

          if (variant.bitrate) {
            return variant
          } else {
            return nextVariant
          }
        })

        const url = maxBitrateVideo.url
        const name = /(.+)(\/)(.+?)((\?)(.*)|$)/.exec(url)
        if (name === null) {
          throw new Error()
        }

        const response = await axios.get(url, {
          responseType: 'stream',
        })
        response.data.pipe(fs.createWriteStream(`${process.cwd()}/${screen_name}/${tweet.id_str}-${name[3]}`))
      }
    })
  )
}

export default media
