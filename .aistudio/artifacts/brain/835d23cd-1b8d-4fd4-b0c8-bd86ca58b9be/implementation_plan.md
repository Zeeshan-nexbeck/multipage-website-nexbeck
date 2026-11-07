# Clean URLs & 301 Permanent Redirects Architecture

Transition the entire Nexbeck platform to professional, extensionless clean URLs across all navigation links, buttons, and footers, accompanied by 301 permanent redirects on Cloudflare Pages and the local Vite development server.

## User Review & Critical Decisions

> [!IMPORTANT]
> The target production hosting platform is **Cloudflare Pages / Workers** (deployed via `wrangler deploy`), and the redirect status code is confirmed as **301 Moved Permanently**.
>
> All internal links will point directly to clean paths (`/`, `/services`, `/about`, `/contact`, and parameter-driven URLs like `/contact?package=audit`).

- **Confirmed Decision 1**: Hosting platform is Cloudflare Pages / Workers. Configuration will be deployed via a standard `_redirects` file in `project/public/_redirects` (auto-bundled into `dist/_redirects`).
- **Confirmed Decision 2**: HTTP status code `301 Moved Permanently` for all legacy `.html` requests.
- **Confirmed Decision 3**: Vite development server middleware will be upgraded to perform actual HTTP 301 redirects on `.html` URLs while serving clean routes seamlessly.

---

## 1. Overview & Core Concept

- **What It Does**: Eliminates dated `.html` extensions from all visible user-facing URLs, navigation menus, footer columns, and contextual links across the site. Directs all search bots and users to standardized clean endpoints.
- **Target Audience / Persona**: Australian homeowners, builders, and electricians who expect modern, professional digital experiences, as well as search engine crawlers (Googlebot) evaluating technical SEO hygiene.
- **Key Value**: Clean aesthetic, improved search engine indexing consistency, and zero duplicate-content risk between `.html` and non-`.html` variants.

---

## 2. User Experience & Routing Flows

### User Journey & Link Structure
1. **Header & Logo**: Clicking the Nexbeck brand logo navigates to `/`.
2. **Main Navigation**: Links to `/services`, `/about`, `/contact`.
3. **Contextual Action Buttons**: CTA buttons lead to `/contact`, `/services#pricing`, or query-string packages like `/contact?package=audit`.
4. **Footer Links**: Clean paths throughout all 4 columns.
5. **Legacy / Bookmark Access**: If a user or external backlink visits `nexbeck.com/services.html`, the edge server immediately returns a `301 Moved Permanently` response redirecting them to `nexbeck.com/services`.

### Navigation State Preservation
- `initHeaderAndNav()` in `project/script.js` evaluates active page states by path normalization. Clean URLs ensure exact segment matching so active underline and dot indicators remain visually responsive on both desktop and mobile drawers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Edge-Level Redirects vs. Client-Side Meta Refresh**
  - *Chosen Approach*: Server-level HTTP 301 redirects via Cloudflare Pages `_redirects` engine and Vite dev middleware.
  - *Why*: HTTP 301 passes 100% of link equity and signals canonical location immediately to search engine crawlers, preventing SEO dilution.
  - *Alternatives Considered*: Client-side JavaScript redirects (flawed, slower, causes search engine confusion).

- **Decision 2: Absolute Root-Relative Links (`/services`) vs. Relative Links (`services`)**
  - *Chosen Approach*: Root-relative paths (`/`, `/services`, `/about`, `/contact`).
  - *Why*: Guarantees predictable resolution regardless of nested sub-paths, 404 error page contexts, or query strings.
  - *Alternatives Considered*: Relative links (`services`) which can resolve incorrectly from sub-paths or error routes.

---

## 4. Technical Architecture & Routing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            Requests URL       │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Cloudflare Pages Edge / Vite Server             │
│                                                             │
│   Does path end with .html?                                 │
│   ├── YES ───► HTTP 301 Redirect ──► Clean URL (e.g. /about)│
│   └── NO  ───► Serve Static HTML ──► Clean Page Rendered    │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Internal Page Links                     │
│   • Logo / Home: /                                          │
│   • Services:    /services, /services#pricing               │
│   • About:       /about                                     │
│   • Contact:     /contact, /contact?package=...             │
└─────────────────────────────────────────────────────────────┘
```

### Component & File Mapping

1. **`project/index.html`**:
   - Replace all `index.html` with `/`
   - Replace all `services.html` with `/services`
   - Replace all `about.html` with `/about`
   - Replace all `contact.html` with `/contact`
   - Update parameter links (e.g. `contact.html?package=...` -> `/contact?package=...`)

2. **`project/services.html`**:
   - Replace all `.html` references in navigation, CTAs, package selectors, and footer with clean URLs.

3. **`project/about.html`**:
   - Replace all `.html` references in navigation, milestones, CTAs, and footer with clean URLs.

4. **`project/contact.html`**:
   - Replace all `.html` references in navigation, sidebar links, and footer with clean URLs.

5. **`project/404.html`**:
   - Replace `/index.html`, `/services.html`, `/about.html`, `/contact.html` with clean URLs.

6. **`project/public/_redirects` (New File)**:
   - Cloudflare Pages redirect rules:
     ```text
     /index.html / 301
     /services.html /services 301
     /about.html /about 301
     /contact.html /contact 301
     ```

7. **`vite.config.ts`**:
   - Upgrade middleware to send real HTTP 301 redirects for any incoming `.html` requests, and cleanly rewrite extensionless paths to the respective HTML file for local testing.

8. **`project/public/sitemap.xml` & Canonical Tags**:
   - Verification pass ensuring 100% parity with clean URLs.
