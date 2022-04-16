const handlePullRequestChange = require('./lib/handle-pull-request-change')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.on('pull_request.opened', handlePullRequestChange)
  app.on('pull_request.edited', handlePullRequestChange)
  app.on('pull_request.synchronize', handlePullRequestChange)
}
