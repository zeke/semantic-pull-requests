module.exports = handlePullRequestChange

const simpleCommitMessage = require('simple-commit-message')

async function handlePullRequestChange (context) {
  const {title, html_url: htmlUrl, head} = context.payload.pull_request
  const isSemantic = isSemanticMessage(title) || await commitsAreSemantic(context)
  const status = isSemantic ? 'success' : 'pending'

  console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)

  context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: 'https://github.com/apps/semantic-pull-request',
    description: isSemantic ? 'good to go' : 'missing semantic commit message or PR title' ,
    context: 'Semantic Pull Request'
  }))
}

function isSemanticMessage(message) {
  return simpleCommitMessage.validate(message)
}

async function commitsAreSemantic (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  console.log('commits[0]', commits[0])

  return commits.data.map(element => element.commit.message).some(isSemanticMessage)
}