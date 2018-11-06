import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import {promisify} from 'util'

import media from './media'
// import {firstUserTimeline, userTimeline} from './timeline'
// import {firstSearchUniversal, searchUniversal} from './timeline'
import {firstSearchPremium, searchPremium} from './timeline'

const writeFile = promisify(fs.writeFile)

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
    tweets.forEach(async tweet => {
      // this.timeline.push(tweet)
      // this.timeline.push(tweet.status.data)
      this.timeline.push(tweet)
    })

    console.log(tweets);

    const saveJson = async () => {
      await writeFile(`${process.cwd()}/${this.timeline[0].user.screen_name}.json`, JSON.stringify(this.timeline, null, 2))
    }

    const saveMedia = async () => {
      tweets.map(async tweet => {
        // if (tweet.extended_entities && tweet.extended_entities.media) {
        //   await media(tweet)
        // }
        // if (tweet.status.data.extended_entities && tweet.status.data.extended_entities.media) {
        //   await media(tweet.status.data)
        // }
        if (!tweet.retweeted_status && (tweet.extended_tweet && tweet.extended_tweet.extended_entities && tweet.extended_tweet.extended_entities.media || tweet.extended_entities && tweet.extended_entities.media)) {
          await media(tweet)
        }

        // this.log(`Done: ${tweet.id_str}`)
        // this.log(`Done: ${tweet.status.data.id_str}`)
        this.log(`Done: ${tweet.id_str}`)
      })
    }

    await Promise.all([saveJson(), saveMedia()])

    // const oldestTweet = this.timeline[this.timeline.length - 1]
    // const oldestTweetLess = parseInt(oldestTweet.id_str, 10) - 1
    // return oldestTweetLess.toString()
  }

  async run() {
    const {flags} = this.parse(TimelineMediaDownloader)

    const name = flags.name ? flags.name : ''

    let id = ''
    let nextId = ''

    // const tweets: any[] = await firstUserTimeline(name)
    // const tweets: any = await firstSearchUniversal(name)
    const tweets: any = await firstSearchPremium(name)
    // nextId = await this.store(tweets)
    // nextId = await this.store(tweets.modules)
    await this.store(tweets.results)
    nextId = tweets.next

    while (id !== nextId) {
      id = nextId
      // const tweets: any[] = await userTimeline(name, id)
      // const tweets: any = await searchUniversal(name, id)
      const tweets: any = await searchPremium(name, id)
      // nextId = await this.store(tweets)
      // nextId = await this.store(tweets.modules)
      await this.store(tweets.results)
      nextId = tweets.next
    }
  }
}

export = TimelineMediaDownloader
