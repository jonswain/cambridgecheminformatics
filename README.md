# cambridgecheminformatics.com

Static site for Cambridge Cheminformatics Consulting, served by GitHub Pages.
No build step: plain HTML, CSS and a little JavaScript.

## Preview locally

    python3 -m http.server 8642
    # open http://localhost:8642

## Structure

- `index.html` – home (services, intro, latest blog posts)
- `about/index.html`, `contact/index.html` – inner pages (keep the old WordPress URLs)
- `404.html` – not-found page
- `assets/css/style.css` – all styles (light and dark mode)
- `assets/fonts/` – self-hosted fonts (Inter, Space Grotesk, IBM Plex Mono; SIL Open Font License)
- `assets/img/og-card.png` – 1200×630 social share image
- `assets/js/main.js` – header shadow, email de-obfuscation, latest posts from
  https://jonswain.github.io/feed.xml (falls back to the static list in `index.html`)

## Notes

- Links use relative paths so the site also works at `jonswain.github.io/<repo>/` while testing.
- The contact email is stored reversed in `contact/index.html` (`data-email-u` / `data-email-d`).
- A `CNAME` file containing `cambridgecheminformatics.com` is added when the domain is switched over.
