module.exports = handlePullRequestChange

async function handlePullRequestChange (context) {
  const {title, html_url: htmlUrl, head} = context.payload.pull_request
  const isSemantic = isSemantic(title) || await commitsAreSemantic(context)
  const status = isSemantic ? 'success' : 'pending'

  console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)

  context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: 'https://github.com/apps/semantic-pull-request',
    description: isSemantic ? 'ready for review' : 'missing semantic commit message or PR title' ,
    context: 'Semantic Pull Request'
  }))
}

function isSemantic(title) {
  if (title.startsWith('fix:')) return true
  if (title.startsWith('feature:')) return true
  if (title.startsWith('BREAKING CHANGE:')) return true
  return false
}

async function commitsAreSemantic (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  return commits.data.map(element => element.commit.message).some(isSemantic)
}