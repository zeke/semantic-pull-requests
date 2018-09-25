# Semantic Pull Requests

[![Build Status](https://travis-ci.com/zieka/commit-cop.svg?branch=master)](https://travis-ci.com/zieka/commit-cop)

> GitHub status check that ensures your pull requests follow the Conventional Commits spec

Using [semantic-release](https://github.com/semantic-release/semantic-release)
and [conventional commit messages](https://conventionalcommits.org)? Install this
[Probot](https://probot.github.io/) app
on your repos to ensure your pull requests are semantic before you merge them.

## How it works

| Scenario                                         | Status | Status Check Message                |
| ------------------------------------------------ | ------ | ----------------------------------- |
| PR title is [semantic][conventional commit type] | 💚     | `ready to be squashed`              |
| any commit is semantic                           | 💚     | `ready to be merged or rebased`     |
| nothing is semantic                              | 💛     | `add a semantic commit or PR title` |

## Example Scenario

Take this PR for example. None of the commit messages are semantic, nor is the PR title, so the status remains yellow:

<img width="580" alt="screen shot 2018-07-14 at 6 22 58 pm" src="https://user-images.githubusercontent.com/2289/42729630-11370698-8793-11e8-922c-db2308e0e98e.png">

<img width="791" alt="screen shot 2018-07-14 at 6 22 10 pm" src="https://user-images.githubusercontent.com/2289/42729629-110812b6-8793-11e8-8c35-188b0952fd66.png">

---

Edit the PR title by adding a semantic prefix like `fix:` or `feat:` or any other
[conventional commit type]. Now use `Squash and Merge` to squash the branch onto master and write a standardized commit message while doing so:

---

<img width="613" alt="screen shot 2018-07-14 at 6 23 11 pm" src="https://user-images.githubusercontent.com/2289/42729631-1164bd36-8793-11e8-9bf9-d2eeb9dd06e1.png">

<img width="785" alt="screen shot 2018-07-14 at 6 23 23 pm" src="https://user-images.githubusercontent.com/2289/42729632-11980b32-8793-11e8-9f8d-bf16c707f542.png">

## Installation

👉 [github.com/apps/semantic-pull-requests](https://github.com/apps/semantic-pull-requests)

## License

[Apache 2.0](LICENSE)

[conventional commit type]: https://github.com/commitizen/conventional-commit-types/blob/master/index.json
