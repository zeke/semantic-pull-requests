const isSemanticMessage = require('../lib/is-semantic-message')

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

test.only('should check message scope', () => {
  expect(isSemanticMessage('fix(validScope): something', ['validScope'])).toBe(true)
  expect(isSemanticMessage('fix(invalidScope): something', ['validScope'])).toBe(false)
  expect(isSemanticMessage('fix(): something', ['validScope'])).toBe(false)
})
