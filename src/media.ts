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
  sizes: {}
}

const media = async (tweet: any) => {
  const mediaArray: Media[] = tweet.extended_entities.media

  try {
    fs.readdirSync(`${process.cwd()}/media`)
  } catch {
    fs.mkdirSync(`${process.cwd()}/media`)
  }

  await Promise.all(
    mediaArray.map(async media => {
      const url = media.media_url_https
      const name = /(.+)(\/)(.+)/.exec(url)
      if (name === null) {
        throw new Error()
      }

      const response = await axios.get(url, {
        responseType: 'stream',
      })
      response.data.pipe(fs.createWriteStream(`${process.cwd()}/media/${tweet.id_str}-${name[3]}`))
    })
  )
}

export default media
