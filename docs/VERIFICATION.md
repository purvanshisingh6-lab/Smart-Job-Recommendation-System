# Verification record for this packaged build

Checks actually executed in the packaging environment:

- `node --check` passed for every JavaScript file in `js/`.
- `backend/pom.xml` parsed successfully as XML.
- `package.json` and `vercel.json` parsed successfully as JSON.
- The HTML files were parsed with Python's standard HTML parser. The only apparent local-reference misses were the root-absolute paths in `404.html` (`/assets/...`, `/css/...`, `/index.html`, `/js/...`), which are intentional for deployment at the site root.
- The project tree was checked to ensure Maven `target/` build output and temporary duplicate ZIP artifacts are not included.

Checks not executed:

- `mvn clean test` was attempted from `backend/`, but Maven is not installed in the packaging environment (`mvn: command not found`). An attempt to install Maven through the package manager timed out. Therefore the Java project has **not** been compiled or run here, and the included JUnit test has **not** been executed.
- Because the backend could not be started, HTTP endpoint tests, database integration tests, browser-based frontend/backend integration tests and deployment verification could not be performed.

Run `mvn clean test` and `mvn spring-boot:run` from `backend/` on a machine with Java 21, Maven and dependency repository access before presenting the application as fully verified.
