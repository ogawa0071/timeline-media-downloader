import client from './twitter'

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

export {firstUserTimeline, userTimeline}
