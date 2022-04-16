const commitTypes = Object.keys(require('conventional-commit-types').types)
const parser = require('@conventional-commits/parser')

module.exports = function isSemanticMessage (message, validScopes, validTypes, allowMergeCommits, allowRevertCommits) {
  const isMergeCommit = message && message.startsWith('Merge')
  if (allowMergeCommits && isMergeCommit) return true

  const isRevertCommit = message && message.startsWith('Revert')
  if (allowRevertCommits && isRevertCommit) return true

  let result
  try {
    result = parser.toConventionalChangelogFormat(parser.parser(message))
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') console.error(error)
    return false
  }

  const { scope: scopes, type } = result
  const isScopeValid = !validScopes || !scopes || scopes.split(',').map(scope => scope.trim()).every(scope => validScopes.includes(scope))
  return (validTypes || commitTypes).includes(type) && isScopeValid
}
