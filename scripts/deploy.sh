#!/bin/sh

# https://github.com/zeit/now-cli/issues/817
now="npx now@7.1.1 --token=$NOW_TOKEN"

$now --public
$now alias
$now rm --safe --yes wip-bot
