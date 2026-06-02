# infrastructure/docker

Holds shared Docker assets that are not owned by a single service.

Per-service `Dockerfile`s live **with their module** (e.g.
`services/auth-service/Dockerfile`) so each image is built from the repo root
build context defined in the root `docker-compose.yml`.

Use this folder for cross-cutting Docker assets as the platform grows, e.g.:
- a shared base JRE image
- compose override files (`docker-compose.override.yml`, `docker-compose.prod.yml`)
- buildx/bake configuration
