const commitTypes = Object.keys(require('conventional-commit-types').types)
const { validate } = require('parse-commit-message')

module.exports = function isSemanticMessage (message, scopes, allowMergeCommits) {
  const isMergeCommit = message && message.startsWith('Merge')
  if (allowMergeCommits && isMergeCommit) return true

  const { error, value: commits } = validate(message, true)

  if (error) {
    console.error(error)
    return false
  }

  const [result] = commits
  const { scope, type } = result.header
  const isScopeValid = !scopes || !scope || scopes.includes(scope)
  return commitTypes.includes(type) && isScopeValid
}
