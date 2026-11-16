# TeasLeisure browser demo

The browser demos include the uni-app H5 frontend and a standalone platform moderation console. They use local sample data and do not require MySQL, Redis, WeChat credentials, or a running backend.

## Start

```powershell
cd frontend/uni-app
npm ci
npm run dev:h5:demo -- --host 0.0.0.0
```

Open the Vite URL and visit `/#/pages/tl/index` to view the stall and community feed. Open a stall or post to view the detail and sample comments. The home page labels the preview as demo data.

## Platform web demo

In a second terminal, serve the standalone static page with Python 3:

```powershell
cd frontend/admin/public
python -m http.server 5174 --bind 127.0.0.1
```

Open `http://127.0.0.1:5174/teasleisure-demo.html` for the moderation queue. Filters, search, and approve/return buttons work in the browser against local demo data. The regular authenticated admin console remains available through `npm run dev` when the backend is configured.

## Included data

The demo includes six categories, three sample stalls, three sample posts, and sample comments. Stall and post images are local SVG illustrations. Demo API responses are enabled only when Vite runs in development mode with `VITE_TL_DEMO_MODE=true`; regular development and production builds continue to call the configured backend.

Browsing and reading are available. Authentication-dependent actions such as merchant claim submission, publishing, likes, and private messages still require the backend and a logged-in account.

## Demo licensing

The TeasLeisure demo fixtures and SVG illustrations follow the repository license. Bundled third-party assets retain their upstream notices and licenses.
