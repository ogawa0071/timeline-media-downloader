import {Command, flags} from '@oclif/command'

import media from './media'
import {firstUserTimeline, userTimeline} from './timeline'

class TimelineMediaDownloader extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'screen_name'}),
  }

  timeline: any[] = []

  async store(tweets: any[]) {
    tweets.forEach(tweet => {
      this.timeline.push(tweet)
    })

    await Promise.all(
      tweets.map(async tweet => {
        await media(tweet)
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
    this.log(`hello ${name} from ./src/index.ts`)

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
