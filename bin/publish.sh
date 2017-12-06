#!/bin/bash
set -e
git checkout production
git rebase master
git checkout master
git push --all
