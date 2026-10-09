# Security checklist template

Copy this into your workspace `project/SECURITY-CHECKLIST.md` and fill it in
before you make your project repository public.

Every row gets one of **Yes**, **No** or **N/A**, and one line of evidence in
your own words: what you checked, where, and what you found. "N/A" is a correct
answer when it is true, but it needs its reason. A blank row scores nothing, and
a Yes your repository contradicts scores nothing either.

Replace the example evidence with your own.

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | Only the three .env.example files are tracked. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | server/.env.example contains devpassword. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | Application source code contains no hardcoded production credentials. Sensitive values are loaded from environment variables. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | No | Previous commits included the access password. |
| 5 | Any credential that was ever committed has been rotated | Yes | The database password and frontend password were changed, and a successful frontend deployment was confirmed. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | The production DATABASE_URL is configured in Render's Environment settings. |
## GitHub Actions

If your project has no workflows, mark every row N/A and say so once.

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | .github/workflows/deploy-pages.yml uses GitHub repository variables for public frontend configuration; no literal secret was identified in the reviewed workflow. |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | N/A | The GitHub Pages workflow does not require private credentials in the frontend build. Production secrets are configured on the API server. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | Yes | The reviewed deployment logs showed no environment-dumping commands or credential-printing steps. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | The deployed frontend contains the application HTML, JavaScript, and CSS without private credentials or secret configuration files. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | Yes | The workflow pins checkout, setup-node, upload-pages-artifact, and deploy-pages to commit SHAs. |
| 12 | Secret scanning and push protection are enabled on the repository | Yes | The repository settings were confirmed by the user. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | server/tasksRepo.js uses parameter placeholders such as $1, $2, and subsequent placeholders in task queries. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | No | Neon IP restrictions are set to “None set.” Access still depends on valid database credentials and provider controls; no IP allowlist is configured. |
| 15 | The database user the app connects as has only the permissions it needs | No | The API currently connects as neondb_owner, which has broader privileges than a normal application role needs. |
| 16 | Seed and sample data is invented, not real people's data | Yes | The reviewed seed data contains fictional study tasks. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | No matching debug, seed, reset, TRUNCATE, or DROP TABLE API routes were found in server/server.js. Local database scripts are separate from API routes. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | The deployed frontend displays a password gate. This protects the frontend screen only; it does not independently secure the API. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | N/A | The application uses Neon PostgreSQL rather than Supabase or Firebase. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | Yes | The API access password and token-signing secret are stored in server environment variables and are not exposed in public frontend code or documentation. |
| 21 | The gate covers every route, including the ones that only change data | Yes | All task API endpoints require a valid server-issued token. Unauthenticated requests are rejected, including requests to read, create, update, or delete tasks. |
| 22 | The credentials for the gate are environment variables, not in source | Yes | client/src/App.jsx reads import.meta.env.VITE_ACCESS_PASSWORD, supplied by the GitHub Actions workflow. Limitation: frontend build variables are not secure secrets.
## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | Server-side validation checks required task fields, valid dates, supported priority values, and Boolean completion values. Invalid inputs are rejected with appropriate client error responses. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | No dangerouslySetInnerHTML, innerHTML, or outerHTML patterns were found in client/src. Task text is rendered through React. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | The server returns generic 404 and 500 JSON messages. Detailed errors are logged server-side rather than included in client responses. |
| 26 | CORS is not a wildcard on routes that change data | Yes | server/server.js uses the configured CORS_ORIGINS list. Render's value was confirmed as https://merwwki.github.io. CORS does not replace API authentication. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | The committed root security-checklist.md contains an example email address in its template. No actual student number, phone number, or home address was identified by the search. |
| 28 | No classmate's personal data in the repository | Yes | The search found general reminder text about protecting classmates' data, not actual classmates' personal information. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | Both package lockfiles are present, no node_modules files are tracked, and both production dependency audits returned zero vulnerabilities. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | docs/assets/screenshot.png was the only substantive asset found, and the user confirmed it is their own screenshot. .DS_Store is present and may be removed as housekeeping. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | Yes | The GitHub repository is intentionally public for course submission, and its visibility has been reviewed. |

## Anything I found and fixed

StudySprint Planner uses environment variables for server-side credentials, parameterized database queries, server-side input validation, an application password, and signed authentication tokens. Task API routes require authentication, and the frontend uses React's standard rendering protections.
Database network restrictions, a dedicated least-privilege database role, and complete removal of historical credentials are outside the current implementation scope.
