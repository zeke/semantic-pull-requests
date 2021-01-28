const commitTypes = Object.keys(require('conventional-commit-types').types)
const isScopeValid = require('./is-scope-valid')
const { validate } = require('parse-commit-message')

module.exports = function isSemanticMessage (
  message,
  validScopes,
  validTypes,
  allowMergeCommits,
  allowRevertCommits
) {
  const isMergeCommit = message && message.startsWith('Merge')
  if (allowMergeCommits && isMergeCommit) return true

  const isRevertCommit = message && message.startsWith('Revert')
  if (allowRevertCommits && isRevertCommit) return true

  const { error, value: commits } = validate(message, true)

  if (error) {
    if (process.env.NODE_ENV !== 'test') console.error(error)
    return false
  }

  const [result] = commits
  const { type } = result.header
  const validCommitType = (validTypes || commitTypes).includes(type)
  const isValidScope = isScopeValid(commits, validScopes)
  return validCommitType && isValidScope
}
