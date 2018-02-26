module.exports = handlePullRequestChange

async function handlePullRequestChange (context) {
  const {title, html_url: htmlUrl, head} = context.payload.pull_request
  const isWip = containsWIP(title) || await commitsContainWIP(context) || await labelsContainWIP(context)
  const status = isWip ? 'pending' : 'success'

  console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)

  context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: 'https://github.com/apps/wip',
    description: isWip ? 'work in progress – do not merge!' : 'ready for review',
    context: 'WIP'
  }))
}

async function commitsContainWIP (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  return commits.data.map(element => element.commit.message).some(containsWIP)
}

async function labelsContainWIP (context) {
  const labels = await context.github.issues.getIssueLabels(context.repo({
    number: context.payload.pull_request.number
  }))

  return labels.data.map(label => label.name).some(containsWIP)
}

function containsWIP (string) {
  return /\b(wip|do not merge)\b/i.test(string)
}
