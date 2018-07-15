const isSemanticMessage = require('../lib/is-semantic-message')

test('passes when messages are semantic', () => {
  expect(isSemanticMessage('fix: something')).toBe(true)
})
