<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b86c8665-2df5-494d-aa66-886e7a5289b5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`


## SEO and sitemap

- `GET /sitemap.xml` is generated from the full `ARTICLES` catalog and lists `/makale/<slug>` URLs.
- Public article pages at `/makale/<slug>` return crawlable HTML with article-specific title, description, canonical URL, and content.
- `public/sitemap.xml` is a physical fallback sitemap for static inspection; when running the Express server, the dynamic `/sitemap.xml` route is authoritative.
- `public/robots.txt` allows public content and disallows crawling `/api/` endpoints.
- After deploying, submit `https://sci-phi.ai.studio/sitemap.xml` in Google Search Console and Bing Webmaster Tools. A code change cannot submit URLs to those accounts automatically and search engines decide which URLs to index.
