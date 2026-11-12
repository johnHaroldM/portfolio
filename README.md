# Calling-card portfolio

A single static page built with React, Tailwind CSS and Three.js (React Three Fiber).
Designed phone-first, because most visitors arrive by scanning the QR code on your card.

- **3D calling card** at the top — tilts with the mouse, drag or tap to flip. The back carries a QR code so
  someone can scan it straight off your screen.
- **Save contact** downloads a `.vcf` file that opens in Contacts on iPhone and Android.
- On phones, a small action bar (Save contact / Email / Call) follows you down the page.
- Light and dark themes follow the visitor's system setting; reduced-motion settings are respected.
- No backend — it builds to plain HTML/CSS/JS you can host anywhere for free.

## 1. Put in your details

Everything lives in **`src/content.js`**: name, role, email, phone, website, projects, skills, experience,
social links. The 3D card, page title, favicon and contact file are all generated from it.

## Screenshots (3D "Screens" section)

1. Put images in `public/screens/` (WebP or PNG, about 1600 px wide; blur names, IPs and real data first).
2. List them on the project in `src/content.js`:
   `screens: ['screens/asad-portal-1.webp', { src: 'screens/asad-portal-2.webp', caption: 'Report form' }]`

The section and its nav link appear once any project has a screenshot. Visitors drag the 3D carousel
(or use the arrow buttons) and tap the front window to view it full size.

## 2. Run it locally

```bash
npm install
npm run dev
```

## 3. Build the static site

```bash
npm run build
```

The finished site is in the `dist/` folder.

## 4. Put it online with GitHub Pages (free)

The repo includes `.github/workflows/deploy.yml`, which builds and publishes the site every time you push to `main`.

1. Create a new **public** repository on GitHub and push this folder to it (branch `main`).
   - Name it `your-username.github.io` → the site lives at `https://your-username.github.io/`
     (shortest address, best for a QR code).
   - Any other name, e.g. `portfolio` → `https://your-username.github.io/portfolio/`
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to turn green (about a minute).
   If the first run finished before you changed the setting in step 2, click it and choose **Re-run all jobs**.
4. Set `profile.website` in `src/content.js` to that address, commit and push again — this updates the QR code
   on the 3D card and the "Save contact" file.

Want your own domain (e.g. `yourname.com`)? Add it under Settings → Pages → Custom domain and update
`profile.website`. Decide this **before** printing cards — the printed QR code must point at the final address.

## 5. QR code for the printed card

```bash
npm run qr
```

Creates `qr/portfolio-qr.svg` (send this to the printer) and `qr/portfolio-qr.png`.
Print it at least 2 × 2 cm and test-scan a proof before ordering.
