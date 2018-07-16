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
    const commits = [
      {commit: {message: 'fix something'}},
      {commit: {message: 'fix something else'}}
    ]
    const expectedBody = {
      state: 'pending',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      description: 'add semantic commit or PR title',
      context: 'Semantic Pull Request'
    }

    const mock = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, commits)
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })

  test('sets `success` status if PR has a semantic title', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'fix: bananas'
    const expectedBody = {
      state: 'success',
      description: 'good to go',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      context: 'Semantic Pull Request'
    }

    // since the title is semantic, no GET request for commits is needed
    const mock = nock('https://api.github.com')
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })

  test('allows `build:` as a prefix', async () => {
    const context = buildContext()
    context.payload.pull_request.title = 'build: publish to npm'
    const expectedBody = {
      state: 'success',
      description: 'good to go',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      context: 'Semantic Pull Request'
    }

    // since the title is semantic, no GET request for commits is needed
    const mock = nock('https://api.github.com')
      .post('/repos/sally/project-x/statuses/abcdefg', expectedBody)
      .reply(200)

    await handlePullRequestChange(context)
    expect(mock.isDone()).toBe(true)
  })
})

function buildContext (overrides) {
  const defaults = {
    log: () => { /* no-op */ },

    // an instantiated GitHub client like the one probot provides
    github: github,

    // context.repo() is a probot convenience function
    repo: (obj = {}) => {
      return Object.assign({owner: 'sally', repo: 'project-x'}, obj)
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
