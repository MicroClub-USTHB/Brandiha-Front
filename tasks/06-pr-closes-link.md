# PR #42 body is missing its `Closes #` line

**Where:** PR #42 (`feat/refresh-token-integration`) description
**Status:** not done — needs the issue number

## What

`AGENTS.md` requires every PR body to link its issue with a closing keyword
(`Closes #NN`), one line per issue — a comma-separated list does not work. The
`.github/pull_request_template.md` has the line; PR #42's body does not.

## What to do

Add `Closes #NN` to the PR body with the right issue number. If no issue exists
for this work, either open one or note explicitly that the PR is unlinked, so it
is a decision rather than an oversight.

Note that because PRs target `dev`, GitHub only auto-closes the issue when the
change reaches `main` on the next dev→main promotion.
