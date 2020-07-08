const isSemanticMessage = require('../lib/is-semantic-message')

describe('isSemanticMessage', () => {
  test('returns true when messages are semantic', () => {
    expect(isSemanticMessage('fix: something')).toBe(true)
  })

  test('allows parenthetical scope following the type', () => {
    expect(isSemanticMessage('fix(subsystem): something')).toBe(true)
  })

  test('returns false on bad input', () => {
    expect(isSemanticMessage('')).toBe(false)
    expect(isSemanticMessage(null)).toBe(false)
    expect(isSemanticMessage('unsemantic commit message')).toBe(false)
  })

  test('should check message scope', () => {
    expect(isSemanticMessage('fix(validScope): something', ['validScope'])).toBe(true)
    expect(isSemanticMessage('fix(invalidScope): something', ['validScope'])).toBe(false)
    expect(isSemanticMessage('fix(): something', ['validScope'])).toBe(false)
  })

  test('allows merge commits', () => {
    expect(isSemanticMessage('Merge branch \'master\' into patch-1', null, null, true)).toBe(true)

    expect(isSemanticMessage('Merge refs/heads/master into angry-burritos/US-335', ['scope1'], null, true)).toBe(true)
  })
})

describe('isSemanticMessage - Handling validTypes', () => {
  test('return true for all default types when validTypes is provided', () => {
    expect(isSemanticMessage('feat: something')).toBe(true)
    expect(isSemanticMessage('fix: something')).toBe(true)
    expect(isSemanticMessage('docs: something')).toBe(true)
    expect(isSemanticMessage('style: something')).toBe(true)
    expect(isSemanticMessage('refactor: something')).toBe(true)
    expect(isSemanticMessage('perf: something')).toBe(true)
    expect(isSemanticMessage('test: something')).toBe(true)
    expect(isSemanticMessage('build: something')).toBe(true)
    expect(isSemanticMessage('ci: something')).toBe(true)
    expect(isSemanticMessage('chore: something')).toBe(true)
    expect(isSemanticMessage('revert: something')).toBe(true)
  })

  test('return false for none default types when validTypes is provided', () => {
    expect(isSemanticMessage('alternative: something')).toBe(false)
  })

  test('return true for types included in supplied validTypes', () => {
    const customConventionalCommitType = [
      'alternative',
      'improvement'
    ]

    expect(isSemanticMessage('alternative: something', null, customConventionalCommitType)).toBe(true)
    expect(isSemanticMessage('improvement: something', null, customConventionalCommitType)).toBe(true)
  })

  test('return false for types NOT included in supplied validTypes', () => {
    const customConventionalCommitType = [
      'alternative',
      'improvement'
    ]

    expect(isSemanticMessage('feat: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('fix: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('docs: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('style: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('refactor: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('perf: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('test: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('build: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('ci: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('chore: something', null, customConventionalCommitType)).toBe(false)
    expect(isSemanticMessage('revert: something', null, customConventionalCommitType)).toBe(false)
  })
})
