const { validate } = require('parse-commit-message')

module.exports = function isSemanticMessage (message, validTypes, validScopes, allowMergeCommits) {
  const isMergeCommit = message && message.startsWith('Merge')
  if (allowMergeCommits && isMergeCommit) return true

  const { error, value: commits } = validate(message, true)

  if (error) {
    console.error(error)
    return false
  }

  const [result] = commits
  const { scope, type } = result.header
  const isScopeValid = !validScopes || !scope || validScopes.includes(scope)
  return validTypes.includes(type) && isScopeValid
}
