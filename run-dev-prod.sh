#!/bin/bash

# Load environment variables from .env.development.local
set -a # automatically export all variables
source .env.development.local
set +a

# Remove .next directory
rm -rf .next

# Run build and start
pnpm build && pnpm start
