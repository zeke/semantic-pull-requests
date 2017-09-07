module.exports = handlePullRequestChange

async function handlePullRequestChange (robot, context) {
  const api = context.github
  const title = context.payload.pull_request.title
  const sha = context.payload.pull_request.statuses_url.split(/\//).pop()
  const [owner, repo] = context.payload.repository.full_name.split(/\//)
  const isWip = /\bwip\b/i.test(title)
  const status = isWip ? 'error' : 'success'

  console.log(`Updating PR "${title}" (${context.payload.pull_request.html_url}): ${status}`)

  api.repos.createStatus({
    owner,
    repo,
    sha,
    state: status,
    target_url: 'https://github.com/gr2m/wip-bot',
    description: isWip ? 'work in progress – do not merge!' : 'ready for review',
    context: 'WIP'
  })
}
