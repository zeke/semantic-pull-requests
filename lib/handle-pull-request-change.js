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
  const status = isSemantic ? 'success' : 'pending'
  const result = await context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: 'https://github.com/probot/semantic-pull-requests',
    description: isSemantic ? 'good to go' : 'add semantic commit or PR title',
    context: 'Semantic Pull Request'
  }))

  return result
}

// class Commit {
//   constructor (props) {
//     Object.assign(this, props)

//     if (this.message || this.message.length) {
//       Object.assign(this, parseCommitMessage(this.message))
//     }
//     return this
//   }

//   get isSemantic () {
//     return this.type && commitTypes.includes(type)
//   }
// }
