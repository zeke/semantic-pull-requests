module.exports = handlePullRequestChange

const validateCommitMessage = require('validate-commit-msg')

async function handlePullRequestChange (context) {
  const {title, html_url: htmlUrl, head} = context.payload.pull_request
  const isSemantic = validateCommitMessage(title) || await commitsAreSemantic(context)
  const status = isSemantic ? 'success' : 'pending'

  console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)

  context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: 'https://github.com/probot/semantic-pull-requests',
    description: isSemantic ? 'good to go' : 'add semantic commit or PR title',
    context: 'Semantic Pull Request'
  }))
}

function isSemanticCommit (commit) {
  return commit && commit.message && validateCommitMessage(commit.message)
}

async function commitsAreSemantic (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  return commits.data.map(element => element.commit).some(isSemanticCommit)
}
