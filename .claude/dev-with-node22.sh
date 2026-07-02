#!/bin/bash
# Homebrew's node (v25) ships a broken default `localStorage` global that
# crashes Next.js 15.3.5's internal error-page rendering. Force nvm's node 22
# to the front of PATH so `next dev`'s `#!/usr/bin/env node` shebang resolves
# to a working node.
export PATH="/Users/paolofalcioni/.nvm/versions/node/v22.19.0/bin:$PATH"
exec npm run dev
