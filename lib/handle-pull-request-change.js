module.exports = handlePullRequestChange

const isSemanticMessage = require('./is-semantic-message')
const getConfig = require('probot-config')

const DEFAULT_OPTS = {
  titleOnly: false,
  commitsOnly: false,
  titleAndCommits: false,
  scopes: null,
  allowMergeCommits: false
}

async function commitsAreSemantic (commits, scopes, allCommits = false, allowMergeCommits) {
  return commits.map(element => element.commit)[allCommits ? 'every' : 'some'](commit => isSemanticMessage(commit.message, scopes, allowMergeCommits))
}

async function getCommits (context) {
  const { data } = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }))
  return data
}

async function handlePullRequestChange (context) {
  const { title, head } = context.payload.pull_request
  const {
    titleOnly,
    commitsOnly,
    titleAndCommits,
    scopes,
    allowMergeCommits
  } = await getConfig(context, 'semantic.yml', DEFAULT_OPTS)
  const hasSemanticTitle = isSemanticMessage(title, scopes)
  const commits = await getCommits(context)
  const hasSemanticCommits = await commitsAreSemantic(commits, scopes, commitsOnly || titleAndCommits, allowMergeCommits)
  const vanillaConfig = !titleOnly && !commitsOnly && !titleAndCommits

  let isSemantic
  if (titleOnly) {
    isSemantic = hasSemanticTitle
  } else if (commitsOnly) {
    isSemantic = hasSemanticCommits
  } else if (titleAndCommits) {
    isSemantic = hasSemanticTitle && hasSemanticCommits
  } else {
    isSemantic = (hasSemanticTitle || hasSemanticCommits) && commits.length > 1
  }

  const state = isSemantic ? 'success' : 'pending'

  function getDescription () {
    if (vanillaConfig && !isSemantic && commits.length === 1) return 'Squashing a PR with only one commit will use that commit’s message. Please push an empty semantic commit.'
    if (isSemantic && titleAndCommits) return 'ready to be merged, squashed or rebased'
    if (!isSemantic && titleAndCommits) return 'add a semantic commit AND PR title'
    if (hasSemanticTitle && !commitsOnly) return 'ready to be squashed'
    if (hasSemanticCommits && !titleOnly) return 'ready to be merged or rebased'
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
