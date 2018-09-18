module.exports = handlePullRequestChange

const isSemanticMessage = require('./is-semantic-message')

async function commitsAreSemantic (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  return commits.data
    .map(element => element.commit)
    .some(commit => isSemanticMessage(commit.message))
}

async function handlePullRequestChange (context) {
  const { title, head } = context.payload.pull_request
  const hasSemanticTitle = isSemanticMessage(title)
  const hasSemanticCommits = await commitsAreSemantic(context)
  const isSemantic = hasSemanticTitle || hasSemanticCommits
  const state = isSemantic ? 'success' : 'pending'

  function getDescription () {
    if (hasSemanticTitle) return 'ready to be squashed'
    if (hasSemanticCommits) return 'ready to be merged or rebased'
    return 'add a semantic commit or PR title'
  }

  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/probot/semantic-pull-requests',
    description: getDescription(),
    context: 'Semantic Pull Request'
  }
  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}
