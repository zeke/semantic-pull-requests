const handlePullRequestChange = require('../../../lib/handle-pull-request-change')

describe('handlePullRequestChange', () => {
  const createMockContext = prTitle => {
    return {
      repo: jest.fn(),
      payload: {
        pull_request: {
          head: { sha: 'sha' },
          title: prTitle
        }
      },
      github: {
        repos: {
          createStatus: jest.fn()
        },
        pullRequests: {
          getCommits: jest.fn().mockReturnValue({ data: [] })
        },
        issues: {
          getIssueLabels: jest.fn().mockReturnValue({ data: [] })
        }
      }
    }
  }

  const createMockCommitContext = commitMessage => {
    const context = createMockContext('Example PR title')

    context.github.pullRequests.getCommits = jest.fn().mockReturnValue({
      data: [{ commit: { message: commitMessage } }]
    })

    return context
  }

  const createMockLabelContext = labelName => {
    const context = createMockContext('Example PR title')

    context.github.issues.getIssueLabels = jest.fn().mockReturnValue({
      data: [{ name: labelName }]
    })

    return context
  }

  const pendingStatusObject = {
    context: 'WIP',
    description: 'work in progress – do not merge!',
    sha: 'sha',
    state: 'pending',
    target_url: 'https://github.com/apps/wip'
  }

  const successStatusObject = {
    context: 'WIP',
    description: 'ready for review',
    sha: 'sha',
    state: 'success',
    target_url: 'https://github.com/apps/wip'
  }

  it('creates pending status if PR title contains `wip`', async () => {
    const context = createMockContext('[wip] foo bar commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates pending status if PR title contains `WIP`', async () => {
    const context = createMockContext('foo WIP bar commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates pending status if PR title contains `do not merge` case insensitive', async () => {
    const context = createMockContext('foo dO NoT mERGe bar commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates success status if PR title does NOT contain `wip`', async () => {
    const context = createMockContext('[xxx] foo bar commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(successStatusObject)
  })

  it('creates pending status if a commit message contains `wip`', async () => {
    const context = createMockCommitContext('[wip] foo bar commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates pending status if a commit message contains `do not merge`', async () => {
    const context = createMockCommitContext('my DO NOT MERGE commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates success status if a commit message does not contain `wip` or `do not merge`', async () => {
    const context = createMockCommitContext('my commit message')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(successStatusObject)
  })

  it('creates pending status if a label contains `wip`', async () => {
    const context = createMockLabelContext('WIP')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates pending status if a label contains `do not merge`', async () => {
    const context = createMockLabelContext('do not merge')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(pendingStatusObject)
  })

  it('creates success status if a label does not contain `wip` or `do not merge`', async () => {
    const context = createMockLabelContext('bug')
    await handlePullRequestChange(context)

    expect(context.repo).lastCalledWith(successStatusObject)
  })
})
