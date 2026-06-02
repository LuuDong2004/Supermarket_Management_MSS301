# supplier-service (reserved)

Placeholder for the future **supplier-service**. It is intentionally **not yet a
Maven module** so the reactor build stays green until real code exists.

## How to activate

1. Scaffold the standard structure (copy `docs/architecture/SERVICE_TEMPLATE.md`):
   ```
   services/supplier-service/
   ├── src/main/java/com/mss301/supplier/...
   ├── src/main/resources/{application.yml, db/migration/}
   ├── Dockerfile
   └── pom.xml   (parent = ../../pom.xml)
   ```
2. Register it in the root `pom.xml` `<modules>` as `services/supplier-service`.
3. Add a route in `api-gateway` and a service block in `docker-compose.yml`.

This service owns its **own database/schema** and entities — never share JPA
entities through the `shared/` libraries.
