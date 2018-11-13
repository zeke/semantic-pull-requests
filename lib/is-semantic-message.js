const commitTypes = Object.keys(require('conventional-commit-types').types)
const { validate } = require('parse-commit-message')

module.exports = function isSemanticMessage (message) {
  const { error, value: commits } = validate(message, true)
  if (error) {
    console.error(error)
    return false
  }

  const [result] = commits
  return commitTypes.includes(result.header.type)
}
