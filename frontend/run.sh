#!/bin/sh

set -e

npm run prod
npm prune --production