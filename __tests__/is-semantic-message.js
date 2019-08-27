const isSemanticMessage = require('../lib/is-semantic-message')

describe('isSemanticMessage', () => {
  test('returns true when messages are semantic', () => {
    expect(isSemanticMessage('fix: something', ['fix'])).toBe(true)
  })

  test('allows parenthetical scope following the type', () => {
    expect(isSemanticMessage('fix(subsystem): something', ['fix'])).toBe(true)
  })

  test('returns false on bad input', () => {
    expect(isSemanticMessage('', ['fix'])).toBe(false)
    expect(isSemanticMessage(null, ['fix'])).toBe(false)
    expect(isSemanticMessage('non-semantic commit message', ['fix'])).toBe(false)
  })

  test('should check message scope', () => {
    expect(isSemanticMessage('fix(validScope): something', ['fix'], ['validScope'])).toBe(true)
    expect(isSemanticMessage('fix(invalidScope): something', ['fix'], ['validScope'])).toBe(false)
    expect(isSemanticMessage('fix(): something', ['fix'], ['validScope'])).toBe(false)
  })

  test('allows merge commits', () => {
    expect(isSemanticMessage('Merge branch \'master\' into patch-1', ['fix'], null, true)).toBe(true)

    expect(isSemanticMessage('Merge refs/heads/master into angry-burritos/US-335', ['fix'], ['scope1'], true)).toBe(true)
  })

  test('should check for allowed types', () => {
    const commonConventionalCommitType = [
      'feat',
      'fix',
      'refactor'
    ]

    expect(isSemanticMessage('feat: Add something', commonConventionalCommitType)).toBe(true)
    expect(isSemanticMessage('fix: Fix something', commonConventionalCommitType)).toBe(true)
    expect(isSemanticMessage('refactor: Updated something', commonConventionalCommitType)).toBe(true)

    const customConventionalCommitType = [
      'feat',
      'fix',
      'refactor',
      'alternative'
    ]
    expect(isSemanticMessage('alternative: Do alternative stuff', customConventionalCommitType)).toBe(true)
    expect(isSemanticMessage('other: Do other stuff', customConventionalCommitType)).toBe(false)
  })
})
