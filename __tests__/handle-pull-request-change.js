const handlePullRequestChange = require('../lib/handle-pull-request-change')
const nock = require('nock')
const github = require('@octokit/rest')()

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

describe('handlePullRequestChange', () => {
  test('it is a function', () => {
    expect(typeof handlePullRequestChange).toBe('function')
  })

  test('sets `pending` status if PR has no semantic commits and no semantic title', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'do a thing'
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      description: 'add a semantic commit or PR title',
      context: 'Semantic Pull Request'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)
      .get('/repos/sally/project-x/contents/.github/semantic.yml')
      .reply(200, getConfigResponse())

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })

  describe('custom scopes', () => {
    test('sets `success` status if PR has semantic title with available scope', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix(scope1): bananas'
      const expectedBody = {
        state: 'success',
        description: 'ready to be squashed',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          titleOnly: true
          scopes:
            - scope1
            - scope2
          `))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has semantic title with invalid scope', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix(scope3): do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          titleOnly: true
          scopes:
            - scope1
            - scope2
          `))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has semantic commit with invalid scope', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix(scope3): do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'make sure every commit is semantic',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          commitsOnly: true
          scopes:
            - scope3
            - scope4
          `
        ))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `success` status if PR has semantic title with available scope', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix(scope1): bananas'
      const expectedBody = {
        state: 'success',
        description: 'ready to be squashed',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          titleOnly: true
          scopes:
            - scope1
            - scope2
          `
        ))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  describe('when `commitsOnly` is set to `true` in config', () => {
    test('sets `pending` status if PR has no semantic commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'make sure every commit is semantic',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('commitsOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has no semantic commits but has a semantic title', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix: do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'make sure every commit is semantic',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('commitsOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if one or commits are not well formed', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'make sure every commit is semantic',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, [...unsemanticCommits(), ...semanticCommits()])
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('commitsOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('Only lints commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'bananas'
      const expectedBody = {
        state: 'success',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'ready to be merged or rebased',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('commitsOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  describe('when `titleOnly` is set to `true` in config', () => {
    test('sets `pending` status if PR has no semantic PR title', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has no semantic PR title but has semantic commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('Only lints title', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'build: do a thing'
      const expectedBody = {
        state: 'success',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'ready to be squashed',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleOnly: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  describe('when `titleAndCommits` is set to `true` in config', () => {
    test('sets `pending` status if PR has no semantic PR title', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic commit AND PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleAndCommits: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has no semantic PR title but has semantic commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic commit AND PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleAndCommits: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('sets `pending` status if PR has no semantic PR title and has no semantic commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'do a thing'
      const expectedBody = {
        state: 'pending',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'add a semantic commit AND PR title',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, unsemanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleAndCommits: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })

    test('lints title and commits', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'build: do a thing'
      const expectedBody = {
        state: 'success',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        description: 'ready to be merged, squashed or rebased',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, semanticCommits())
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse('titleAndCommits: true'))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  describe('when `anyCommit` is set to `true` in config', () => {
    describe.each([
      ['commitsOnly', 'add a semantic commit'],
      ['titleAndCommits', 'add a semantic commit AND PR title']
    ])('when no commits are semantic and `%s` is set to `true` in config', (configOption, description) => {
      test(('sets `pending` status with description: ' + description), async () => {
        const context = buildContext()
        context.payload.pull_request.title = 'fix: bananas'
        const expectedBody = {
          state: 'pending',
          target_url: 'https://github.com/probot/semantic-pull-requests',
          description: description,
          context: 'Semantic Pull Request'
        }

        const mock = nock('https://api.github.com')
          .get('/repos/sally/project-x/pulls/123/commits')
          .reply(200, unsemanticCommits())
          .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
          .reply(200)
          .get('/repos/sally/project-x/contents/.github/semantic.yml')
          .reply(200, getConfigResponse(configOption + ': true\nanyCommit: true'))

        await handlePullRequestChange(context)
        expect(mock.isDone()).toBe(true)
      })
    })

    describe.each([
      ['commitsOnly', 'ready to be merged or rebased'],
      ['titleAndCommits', 'ready to be merged, squashed or rebased']
    ])('when all commits are semantic and `%s` is set to `true` in config', (configOption, description) => {
      test(('sets `success` status with description: ' + description), async () => {
        const context = buildContext()
        context.payload.pull_request.title = 'fix: bananas'
        const expectedBody = {
          state: 'success',
          target_url: 'https://github.com/probot/semantic-pull-requests',
          description: description,
          context: 'Semantic Pull Request'
        }

        const mock = nock('https://api.github.com')
          .get('/repos/sally/project-x/pulls/123/commits')
          .reply(200, semanticCommits())
          .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
          .reply(200)
          .get('/repos/sally/project-x/contents/.github/semantic.yml')
          .reply(200, getConfigResponse(configOption + ': true\nanyCommit: true'))

        await handlePullRequestChange(context)
        expect(mock.isDone()).toBe(true)
      })
    })

    describe.each([
      ['commitsOnly', 'ready to be merged or rebased'],
      ['titleAndCommits', 'ready to be merged, squashed or rebased']
    ])('when some commits are semantic and `%s` is set to `true` in config', (configOption, description) => {
      test(('sets `success` status with description: ' + description), async () => {
        const context = buildContext()
        context.payload.pull_request.title = 'fix: bananas'
        const expectedBody = {
          state: 'success',
          target_url: 'https://github.com/probot/semantic-pull-requests',
          description: description,
          context: 'Semantic Pull Request'
        }

        const mock = nock('https://api.github.com')
          .get('/repos/sally/project-x/pulls/123/commits')
          .reply(200, [...unsemanticCommits(), ...semanticCommits()])
          .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
          .reply(200)
          .get('/repos/sally/project-x/contents/.github/semantic.yml')
          .reply(200, getConfigResponse(configOption + ': true\nanyCommit: true'))

        await handlePullRequestChange(context)
        expect(mock.isDone()).toBe(true)
      })
    })
  })

  describe('when `allowMergeCommits` is set to `true` AND `commitsOnly`is set to `true` too in config', () => {
    test('sets `success` status if PR has Merge commit', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix: bananas'
      const expectedBody = {
        state: 'success',
        description: 'ready to be merged or rebased',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, [
          ...semanticCommits(),
          { commit: { message: 'Merge branch \'master\' into feature/logout' } }
        ])
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          commitsOnly: true
          scopes:
            - scope1
            - scope2
          allowMergeCommits: true
          `))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  describe('when `allowMergeCommits` is set to `false` AND `commitsOnly` is set to `true` in config', () => {
    test('sets `pending` status if PR has Merge commit', async () => {
      const context = buildContext()
      context.payload.pull_request.title = 'fix: bananas'
      const expectedBody = {
        state: 'pending',
        description: 'make sure every commit is semantic',
        target_url: 'https://github.com/probot/semantic-pull-requests',
        context: 'Semantic Pull Request'
      }

      const mock = nock('https://api.github.com')
        .get('/repos/sally/project-x/pulls/123/commits')
        .reply(200, [
          { commit: { message: 'Merge branch \'master\' into feature/logout' } }
        ])
        .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
        .reply(200)
        .get('/repos/sally/project-x/contents/.github/semantic.yml')
        .reply(200, getConfigResponse(`
          commitsOnly: true
          allowMergeCommits: false
          `))

      await handlePullRequestChange(context)
      expect(mock.isDone()).toBe(true)
    })
  })

  test('sets `success` status and `ready to be merged or squashed` description if PR has semantic commits but no semantic title', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'bananas'
    const expectedBody = {
      state: 'success',
      description: 'ready to be merged or rebased',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      context: 'Semantic Pull Request'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, semanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)
      .get('/repos/sally/project-x/contents/.github/semantic.yml')
      .reply(200, getConfigResponse())

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })

  test('encourages squashing when title is semantic but commits are not', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'fix: bananas'
    const expectedBody = {
      state: 'success',
      description: 'ready to be squashed',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      context: 'Semantic Pull Request'
    }

    // since the title is semantic, no GET request for commits is needed
    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)
      .get('/repos/sally/project-x/contents/.github/semantic.yml')
      .reply(200, getConfigResponse())

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })

  test('allows `build:` as a prefix', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'build: publish to npm'
    const expectedBody = {
      state: 'success',
      description: 'ready to be squashed',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      context: 'Semantic Pull Request'
    }

    // since the title is semantic, no GET request for commits is needed
    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, unsemanticCommits())
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)
      .get('/repos/sally/project-x/contents/.github/semantic.yml')
      .reply(200, getConfigResponse())

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })
})

function unsemanticCommits () {
  return [
    { commit: { message: 'fix something' } },
    { commit: { message: 'fix something else' } }
  ]
}

function semanticCommits () {
  return [
    { commit: { message: 'build(scope1): something' } },
    { commit: { message: 'build(scope2): something else' } }
  ]
}

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({ owner: 'sally', repo: 'project-x' }, obj)
    },

    payload: {
      pull_request: {
        number: 123,
        title: 'do a thing',
        head: {
          sha: 'abcdefg'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

function getConfigResponse (content = '') {
  return { content: Buffer.from(content).toString('base64') }
}
