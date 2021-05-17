# Semantic Pull Requests

> GitHub status check that ensures your pull requests follow the Conventional Commits spec

Using [semantic-release](https://github.com/semantic-release/semantic-release)
and [conventional commit messages](https://conventionalcommits.org)? Install this
[Probot](https://probot.github.io/) app
on your repos to ensure your pull requests are semantic before you merge them.

:hand: Wanna check your pull requests using a GitHub Actions workflow instead? See [alternatives](#alternatives) below.

## How it works

👮 Note! The default behavior of this bot is not to police all commit messages, 
but rather to ensure that every PR has **just enough semantic information** to be 
able to trigger a release when appropriate. The goal is to gather this semantic
information in a way that doesn't make life harder for project contributors, 
especially newcomers who may not know how to amend their git commit history.

By default, only the PR title OR at least one 
commit message needs to have semantic prefix. If you wish to change this 
behavior, see [configuration](#configuration) section below.

Scenario | Status | Status Check Message
-------- | ------ | -------
PR title is [semantic][conventional commit type] | 💚 | `ready to be squashed`
any commit is semantic | 💚 | `ready to be merged or rebased`
nothing is semantic | 💛 | `add a semantic commit or PR title`

## Example Scenario

Take this PR for example. None of the commit messages are semantic, nor is the PR title, so the status remains yellow:

<img width="580" alt="screen shot 2018-07-14 at 6 22 58 pm" src="https://user-images.githubusercontent.com/2289/42729630-11370698-8793-11e8-922c-db2308e0e98e.png">

<img width="791" alt="screen shot 2018-07-14 at 6 22 10 pm" src="https://user-images.githubusercontent.com/2289/42729629-110812b6-8793-11e8-8c35-188b0952fd66.png">

---

Edit the PR title by adding a semantic prefix like `fix: ` or `feat: ` or any other
[conventional commit type]. Now use `Squash and Merge` to squash the branch onto master and write a standardized commit message while doing so:

---

<img width="613" alt="screen shot 2018-07-14 at 6 23 11 pm" src="https://user-images.githubusercontent.com/2289/42729631-1164bd36-8793-11e8-9bf9-d2eeb9dd06e1.png">

<img width="785" alt="screen shot 2018-07-14 at 6 23 23 pm" src="https://user-images.githubusercontent.com/2289/42729632-11980b32-8793-11e8-9f8d-bf16c707f542.png">


## Installation

👉 [github.com/apps/semantic-pull-requests](https://github.com/apps/semantic-pull-requests)

## Configuration

By default, no configuration is necessary.

If you wish to override some 
behaviors, you can add a `semantic.yml` file to your `.github` directory with 
the following optional settings:

```yml
# Always validate the PR title, and ignore the commits
titleOnly: true
```

```yml
# Always validate all commits, and ignore the PR title
commitsOnly: true
```

```yml
# Always validate the PR title AND all the commits
titleAndCommits: true
```

```yml
# Require at least one commit to be valid
# this is only relevant when using commitsOnly: true or titleAndCommits: true,
# which validate all commits by default
anyCommit: true
```

```yml
# You can define a list of valid scopes
scopes:
  - scope1
  - scope2
  ...
```

```yml
# By default types specified in commitizen/conventional-commit-types is used.
# See: https://github.com/commitizen/conventional-commit-types/blob/v3.0.0/index.json
# You can override the valid types
types:
  - feat
  - fix
  - docs
  - style
  - refactor
  - perf
  - test
  - build
  - ci
  - chore
  - revert
```

```yml
# Allow use of Merge commits (eg on github: "Merge branch 'master' into feature/ride-unicorns")
# this is only relevant when using commitsOnly: true (or titleAndCommits: true)
allowMergeCommits: true
```

```yml
# Allow use of Revert commits (eg on github: "Revert "feat: ride unicorns"")
# this is only relevant when using commitsOnly: true (or titleAndCommits: true)
allowRevertCommits: true
```

## Alternatives

This project is a GitHub App that you can install on one or many repositories, making it a convenient choice if you want to use it on lots of different repos, or even an entire GitHub organization full of repos.

If, however, you want more control over exactly how and when your pull requests are semantically checked, consider writing your own custom Actions workflow using a GitHub Action like [amannn/action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request).

## License

[Apache 2.0](LICENSE)

[conventional commit type]: https://github.com/commitizen/conventional-commit-types/blob/master/index.json
