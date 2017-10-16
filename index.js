module.exports = probotPlugin

const handlePullRequestChange = require('./lib/handle-pull-request-change')

function probotPlugin (robot) {
  robot.on('pull_request.opened', handlePullRequestChange.bind(null, robot))
  robot.on('pull_request.edited', handlePullRequestChange.bind(null, robot))
  robot.on('pull_request.synchronized', handlePullRequestChange.bind(null, robot))
}
