#!/bin/sh

# https://github.com/zeit/now-cli/issues/817
now="npx now --token=$NOW_TOKEN --debug"

echo "$ now --public"
$now --public

echo "$ now alias"
$now alias

echo "$ now rm --safe --yes wip-bot"
$now rm --safe --yes wip-bot
