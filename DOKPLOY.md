# Deploying to Dokploy

## 1. Create the app

In Dokploy, create a new **Application** and point it to this repository.

- **Build type:** Dockerfile
- **Dockerfile path:** `Dockerfile`
- **Build context:** `.`

---

## 2. Build args

These are baked into the browser bundle at build time.
Set them in **Application → Build → Build Args**:

```env
NG_APP_PRODUCTION=true
NG_APP_NAME=Pelis Plus
NG_APP_INDEX_PAGE=landing
NG_APP_POST_LOGIN_ROUTE=/landing
NG_APP_BACKEND_BASE_URL=https://api.yourdomain.com/api
NG_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
NG_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NG_APP_MOCK_ENABLED=false
```

> **Important:** Changing any of these requires a **rebuild** to take effect.

---

## 3. Environment variables

These are read by the SSR server at runtime — no rebuild needed to rotate them.
Set them in **Application → Environment**:

```env
PORT=4000
NODE_ENV=production
NG_APP_TMDB_ACCESS_TOKEN=your_tmdb_bearer_token_here
NG_APP_AUTH_DEMO_EMAIL=demo@pelisplus.com
NG_APP_AUTH_DEMO_PASSWORD=Demo1234!
NG_APP_AUTH_TOKEN_STORAGE_KEY=pelisplus_auth_token
```

> **Tip:** Get your TMDB bearer token from [themoviedb.org → Settings → API](https://www.themoviedb.org/settings/api).

---

## 4. Port

Set the exposed port to **4000** in **Application → General → Port**.

---

## 5. Deploy

Click **Deploy**. Dokploy will build the image and start the SSR server.
