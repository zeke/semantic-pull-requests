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
  const {title, head} = context.payload.pull_request
  const isSemantic = isSemanticMessage(title) || await commitsAreSemantic(context)
  const state = isSemantic ? 'success' : 'pending'
  const status = {
    sha: head.sha,
    state,
    target_url: 'https://github.com/probot/semantic-pull-requests',
    description: isSemantic ? 'good to go' : 'add semantic commit or PR title',
    context: 'Semantic Pull Request'
  }
  const result = await context.github.repos.createStatus(context.repo(status))
  return result
}
