import axios from 'axios'
import * as fs from 'fs'

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
  sizes: {}
}

const media = async (tweet: any) => {
  const mediaArray: Media[] = tweet.extended_entities.media
  await Promise.all(
    mediaArray.map(async media => {
      const url = media.media_url_https
      const name = /(.+)(\/)(.+)/.exec(url) ? /(.+)(\/)(.+)/.exec(url) : null

      try {
        fs.readdirSync(`${process.cwd()}/meida`)
      } catch {
        fs.mkdirSync(`${process.cwd()}/media`)
      }

      const response = await axios.get(media.media_url_https, {
        responseType: 'stream',
      })
      response.data.pipe(fs.createWriteStream(`${process.cwd()}/media/${tweet.id_str}-${name}`))
    })
  )
}

export default media
