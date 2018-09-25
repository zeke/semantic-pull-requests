const commitTypes = Object.keys(require('conventional-commit-types').types)
const parseCommitMessage = require('parse-commit-message').parse

module.exports = function isSemanticMessage (message) {
  try {
    const { type } = parseCommitMessage(
      message.replace(/^[A-Z]*-[0-9]*.-./, '')
    )
    return commitTypes.includes(type)
  } catch (e) {
    return false
  }
}
