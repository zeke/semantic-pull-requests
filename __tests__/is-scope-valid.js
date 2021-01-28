const isScopeValid = require('../lib/is-scope-valid')

const createMockData = (header) => [{ header }]

describe('isScopeValid', () => {
  test('allows parenthetical scope following the type', () => {
    expect(
      isScopeValid(createMockData({ scope: 'subsystem' }), ['subsystem'])
    ).toBe(true)
  })

  test('allows exact match on strings', () => {
    expect(
      isScopeValid(createMockData({ scope: 'validScope' }), ['validScope'])
    ).toBe(true)
    expect(isScopeValid(createMockData({ scope: '' }), [])).toBe(true)
    expect(isScopeValid(createMockData({ scope: null }), [])).toBe(true)
    expect(isScopeValid(createMockData({ scope: undefined }), [])).toBe(true)
    expect(
      isScopeValid(createMockData({ scope: 'allowAllScopes' }), undefined)
    ).toBe(true)
    expect(
      isScopeValid(createMockData({ scope: 'allowAllScopes' }), null)
    ).toBe(true)
  })

  test('rejects not match and substring matches', () => {
    expect(isScopeValid(createMockData({ scope: 'bad' }), ['validScope'])).toBe(
      false
    )
    expect(
      isScopeValid(createMockData({ scope: 'invalidScope' }), ['validScope'])
    ).toBe(false)
  })

  test('Validates multiple scope combinations', () => {
    expect(isScopeValid(createMockData({ scope: '' }), [])).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'validScope,anotherValidScope' }), [
        'validScope',
        'anotherValidScope'
      ])
    ).toBe(true)

    expect(
      isScopeValid(
        createMockData({ scope: 'validScope, spaceAndAnotherValidScope' }),
        ['validScope', 'spaceAndAnotherValidScope']
      )
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'validScope, inValidScope' }), [
        'validScope'
      ])
    ).toBe(false)
  })

  test('Validates regex scopes', () => {
    expect(
      isScopeValid(createMockData({ scope: 'partialvalidScope' }), [
        '/validScope/'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'partialvalidScope' }), [
        'validScope'
      ])
    ).toBe(false)

    expect(
      isScopeValid(createMockData({ scope: 'validScope-1' }), [
        'validScope-\\d/'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'validScope-1,validScope-2' }), [
        '/validScope-\\d/'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'validScope-10' }), [
        '/validScope-\\d+/'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'validScope-10' }), [
        '/^validScope-\\d$/'
      ])
    ).toBe(false)

    expect(
      isScopeValid(createMockData({ scope: 'TASK-1,TASK-0001,TASK-1234' }), [
        '/^TASK-(\\d)+$/'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'TASK-1,TASK-0001,validScope' }), [
        '/^TASK-(\\d)+$/',
        'validScope'
      ])
    ).toBe(true)

    expect(
      isScopeValid(createMockData({ scope: 'TASK-1,TASK-0001,invalidScope' }), [
        '/^TASK-(\\d)+$/',
        'validScope'
      ])
    ).toBe(false)
  })
})
