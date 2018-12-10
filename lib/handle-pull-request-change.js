module.exports = handlePullRequestChange

const isSemanticMessage = require('./is-semantic-message')
const getConfig = require('probot-config')

const DEFAULT_OPTS = {
  titleOnly: false,
  commitsOnly: false
}

async function commitsAreSemantic (context, allCommits = false) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))

  return commits.data
    .map(element => element.commit)[allCommits ? 'every' : 'some'](commit => isSemanticMessage(commit.message))
}

async function handlePullRequestChange (context, config) {
  const { title, head } = context.payload.pull_request
  const { titleOnly, commitsOnly } = await getConfig(context, 'semantic.yml', DEFAULT_OPTS)
  const hasSemanticTitle = isSemanticMessage(title)
  const hasSemanticCommits = await commitsAreSemantic(context, commitsOnly)

  let isSemantic

  if (titleOnly) {
    isSemantic = hasSemanticTitle
  } else if (commitsOnly) {
    isSemantic = hasSemanticCommits
  } else {
    isSemantic = hasSemanticTitle || hasSemanticCommits
  }

  const state = isSemantic ? 'success' : 'pending'

  function getDescription () {
    if (hasSemanticTitle) return 'ready to be squashed'
    if (hasSemanticCommits) return 'ready to be merged or rebased'
    if (titleOnly) return 'add a semantic PR title'
    if (commitsOnly) return 'make sure every commit is semantic'
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
