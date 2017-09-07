#!/bin/sh

# https://github.com/zeit/now-cli/issues/817
npx now@7.1.1 --public --token=$NOW_TOKEN
npx now@7.1.1 rm --safe --yes wip-bot --token=$NOW_TOKEN
