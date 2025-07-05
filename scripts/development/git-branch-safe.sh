#!/bin/bash

# Safe git branch -a alternative that won't hang
# This script lists local and remote branches without triggering network calls

echo "Local branches:"
git branch

echo ""
echo "Remote tracking branches:"
git for-each-ref refs/remotes --format='  %(refname:short)'

echo ""
echo "All branches combined:"
echo "Local branches:"
git branch | sed 's/^/  /'
echo "Remote branches:"
git for-each-ref refs/remotes --format='  %(refname:short)' | sed 's/origin\//  remotes\/origin\//'
