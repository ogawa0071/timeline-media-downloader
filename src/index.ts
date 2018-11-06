import {Command, flags} from '@oclif/command'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

import media from './media'
import {firstUserTimeline, userTimeline} from './timeline'

dotenv.config()

class TimelineMediaDownloader extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'screen_name', required: true}),
  }

  timeline: any[] = []

  async store(tweets: any[]) {
    fs.writeFileSync(`${process.cwd()}/timeline.json`, JSON.stringify(tweets, null, 2))

    tweets.forEach(async tweet => {
      this.timeline.push(tweet)
    })

    await Promise.all(
      tweets.map(async tweet => {
        if (tweet.extended_entities && tweet.extended_entities.media) {
          await media(tweet)
        }
        this.log(`Done: ${tweet.id_str}`)
      })
    )

    const oldestTweet = this.timeline[this.timeline.length - 1]
    const oldestTweetLess = parseInt(oldestTweet.id_str, 10) - 1
    return oldestTweetLess.toString()
  }

  async run() {
    const {flags} = this.parse(TimelineMediaDownloader)

    const name = flags.name ? flags.name : ''

    let id = ''
    let nextId = ''

    const tweets: any[] = await firstUserTimeline(name)
    nextId = await this.store(tweets)

    while (id !== nextId) {
      id = nextId
      const tweets: any[] = await userTimeline(name, id)
      nextId = await this.store(tweets)
    }
  }
}

export = TimelineMediaDownloader
