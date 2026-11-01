# SEO configuration — Al Nokhba

Primary canonical: https://rehabilitation-ju.pages.dev

Cloudflare Pages projects `rehabilitation-ju` and `al-nokhba` both deploy the same GitHub repository. All pages intentionally self-report canonical URLs on the primary hostname, including when served on the alternate hostname.

## Implemented
- Build-time sitemap at `/sitemap.xml`, sourced from all static content slugs, shared material categories, every generated course route, and study-plan routes.
- Public `robots.txt` with sitemap reference.
- Per-route canonical, Open Graph, Twitter preview metadata.
- Independent student initiative Organization and WebSite JSON-LD; BreadcrumbList on course, study-plan, and content pages.

## After publishing
1. Confirm `https://rehabilitation-ju.pages.dev/sitemap.xml` and `/robots.txt` return HTTP 200 and that a few course URLs from the sitemap load.
2. Open Google Search Console, verify ownership of the **primary** site and submit `sitemap.xml`. This requires the site's owner to sign in. Check URL Inspection and Page indexing.
3. Run https://search.google.com/test/rich-results on sample pages and https://pagespeed.web.dev/ on mobile and desktop.
4. Monitor real search queries and add original, helpful course-specific resources rather than repeating keywords.
5. When adopting a custom domain, update `SITE_URL` and `robots.txt` together, and consider redirecting the alternate Pages hostname to the primary one.

Sitemap submission and schema markup do not guarantee indexing, rich results, or rankings. Do not claim verified Search Console access without account confirmation.
