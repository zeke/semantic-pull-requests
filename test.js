const handlePullRequestChange = require('./lib/handle-pull-request-change')
const nock = require('nock')
const github = require('@octokit/rest')()

function context (overrides) {
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
        html_url: 'https://github.com/some/project/pull/123',
        head: {
          sha: 'abcdefg'
        }
      }
    }
  }

  return Object.assign({}, defaults, overrides)
}

// prevent all network activity to ensure mocks are used
nock.disableNetConnect()

describe('handlePullRequestChange', () => {
  test('it is a function', () => {
    expect(typeof handlePullRequestChange).toBe('function')
  })

  test('sets pending status if PR has no semantic commits and no semantic title', async () => {
    const commits = [
      {commit: {message: 'fix something'}},
      {commit: {message: 'fix something else'}}
    ]
    const incoming = nock('https://api.github.com')
      .get('/repos/sally/project-x/pulls/123/commits')
      .reply(200, commits)


    const reqheaders = {
      'accept': [
        'application/vnd.github.v3+json'
      ],
      'user-agent': [
        'octokit/rest.js v15.9.4'
      ],
      'content-type': [
        'application/json; charset=utf-8'
      ],
      'content-length': [
        '165'
      ],
      'accept-encoding': [
        'gzip,deflate'
      ],
      'connection': [
        'close'
      ]
    }

    const body = {
      state: 'pending',
      target_url: 'https://github.com/probot/semantic-pull-requests',
      description: 'add semantic commit or PR title',
      context: 'Semantic Pull Request'
    }
    const outgoing = nock('https://api.github.com', reqheaders)
      .post('/repos/sally/project-x/statuses/abcdefg', body)
      .reply(200)

    await handlePullRequestChange(context())
    expect(incoming.isDone()).toBe(true)
    expect(outgoing.isDone()).toBe(true)
  })
})
