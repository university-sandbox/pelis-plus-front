# ─── Stage 1: Build ────────────────────────────────────────────────────────────
# Use real Node.js (not Bun's shim) so Angular's in-memory SSR module loader
# has access to the full vm API that route extraction requires.
FROM node:22-slim AS builder

# Install Bun for fast dependency installation (uses the real node binary though)
RUN npm install -g bun@1.3.10

WORKDIR /app

# Install dependencies first (layer cache — only re-runs when manifests change)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy full source
COPY . .

# NG_APP_* variables are baked into the browser bundle at build time.
# Override defaults by passing --build-arg in Dokploy (or via its env-vars UI).
ARG NG_APP_PRODUCTION=true
ARG NG_APP_NAME="Pelis Plus"
ARG NG_APP_INDEX_PAGE=landing
ARG NG_APP_POST_LOGIN_ROUTE=/landing
ARG NG_APP_BACKEND_BASE_URL=http://localhost:8080/api
ARG NG_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
ARG NG_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
# Sensitive vars (TMDB token, demo credentials, storage key) are NOT baked in
# at build time. Inject them as runtime env vars in Dokploy / docker run -e.
# The SSR server reads process.env on each request, so no rebuild is needed
# when rotating secrets.
ARG NG_APP_MOCK_ENABLED=false

# ARGs above are available as process.env during RUN steps.
# generate-env-ts.mjs reads them and writes src/environments/env-vars.ts,
# then ng build compiles everything (browser + SSR server bundle).
RUN node scripts/generate-env-ts.mjs && \
    node ./node_modules/.bin/ng build --configuration production

# ─── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# The Angular build produces a self-contained server bundle (esbuild-bundled).
# Only the dist/ output is needed at runtime — no node_modules required.
COPY --from=builder /app/dist ./dist

EXPOSE 4000

ENV PORT=4000 \
    NODE_ENV=production

# SSR server reads process.env at request time, so runtime env vars set in
# Dokploy (NG_APP_*, PORT, etc.) override the baked build-time values for SSR.
CMD ["node", "dist/angular-frontend/server/server.mjs"]
