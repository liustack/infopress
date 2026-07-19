#!/usr/bin/env bash
set -euo pipefail

# Release workflow: bump version → build → commit → tag → push → publish

LEVEL="${1:-}"

if [[ ! "$LEVEL" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: ./scripts/release.sh <patch|minor|major>"
  echo ""
  echo "  patch  — bug fixes, docs, style tweaks"
  echo "  minor  — new features, new templates"
  echo "  major  — breaking changes (API, rename, etc.)"
  exit 1
fi

# 1. Bump version
pnpm version "$LEVEL" --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

echo "Releasing ${TAG}..."

# 2. Build
pnpm build

# 3. Commit version bump
git add package.json
git commit -m "chore(release): ${TAG}"

# 4. Tag
git tag "${TAG}"

# 5. Push commit and tag
git push
git push origin "${TAG}"

# 6. Publish
pnpm publish --access public --no-git-checks

echo "Published @liustack/briefpress@${VERSION}"
