import * as dotenv from 'dotenv'
import * as process from 'process'

import client from './twitter'

dotenv.config()

const firstUserTimeline = async (screen_name: string) => {
  const timeline = await client.get('statuses/user_timeline', {
    tweet_mode: 'extended',
    screen_name,
    count: 200,
    exclude_replies: false,
    include_rts: false,
  })

  return timeline
}

const userTimeline = async (screen_name: string, max_id: string) => {
  const timeline = await client.get('statuses/user_timeline', {
    tweet_mode: 'extended',
    screen_name,
    count: 200,
    max_id,
    exclude_replies: false,
    include_rts: false,
  })

  return timeline
}

const firstSearchUniversal = async (screen_name: string) => {
  const timeline = await client.get('search/universal', {
    tweet_mode: 'extended',
    q: `from:${screen_name}`,
    result_type: 'recent',
    count: 100,
    modules: 'status',
  })

  return timeline
}

const searchUniversal = async (screen_name: string, max_id: string) => {
  const timeline = await client.get('search/universal', {
    tweet_mode: 'extended',
    q: `from:${screen_name} max_id:${max_id}`,
    result_type: 'recent',
    count: 100,
    modules: 'status',
  })

  return timeline
}

const firstSearchPremium = async (screen_name: string) => {
  const timeline = await client.get(`tweets/search/${process.env.TWITTER_PREMIUM_PRODUCT}/${process.env.TWITTER_PREMIUM_LABEL}`, {
    query: `from:${screen_name} has:media`,
    maxResults: 100,
    toDate: "201501010000",
  })

  return timeline
}

const searchPremium = async (screen_name: string, max_id: string) => {
  const timeline = await client.get(`tweets/search/${process.env.TWITTER_PREMIUM_PRODUCT}/${process.env.TWITTER_PREMIUM_LABEL}`, {
    query: `from:${screen_name} has:media`,
    maxResults: 100,
    next: max_id,
  })

  return timeline
}

export {firstUserTimeline, userTimeline, firstSearchUniversal, searchUniversal, firstSearchPremium, searchPremium}
