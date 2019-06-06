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
    expect(isSemanticMessage('non-semantic commit message')).toBe(false)
  })

  test('should check message scope', () => {
    expect(isSemanticMessage('fix(validScope): something', ['validScope'])).toBe(true)
    expect(isSemanticMessage('fix(invalidScope): something', ['validScope'])).toBe(false)
    expect(isSemanticMessage('fix(): something', ['validScope'])).toBe(false)
  })

  test('allows merge commits', () => {
    expect(isSemanticMessage('Merge branch \'master\' into patch-1', null, true)).toBe(true)

    expect(isSemanticMessage('Merge refs/heads/master into angry-burritos/US-335', ['scope1'], true)).toBe(true)
  })
})
