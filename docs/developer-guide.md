# craftisle-draw — Developer Guide

> Online whiteboard built with Next.js + Excalidraw + Prisma. Part of the Craftisle suite.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables below)

# 3. Run Prisma migrations
npx prisma migrate dev

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth API route
│   │   ├── boards/[id]/route.ts           # Single board API (GET/PUT/DELETE)
│   │   ├── boards/route.ts               # Boards list/create API
│   │   └── excalidraw-worker/route.ts  # Excalidraw worker bundle
│   ├── board/[id]/page.tsx              # Main board editor page
│   ├── share/[id]/page.tsx             # Read-only share page
│   ├── test-board/page.tsx             # Dev test page (Excalidraw worker)
│   ├── layout.tsx                     # Root layout (NextAuth SessionProvider)
│   ├── page.tsx                      # Home page (board list)
│   └── globals.css                    # Global styles
├── components/
│   ├── ExcalidrawEditor.tsx          # Core editor component (Excalidraw API)
│   ├── ExcalidrawEditorWrapper.tsx  # Error boundary wrapper
│   ├── BoardList.tsx                # Board list component
│   └── Navbar.tsx                  # Navigation bar
├── lib/
│   ├── boards.ts                    # Board CRUD operations (Prisma)
│   └── db.ts                       # Prisma client singleton
└── auth.ts                          # NextAuth configuration
```

---

## Key components

### `ExcalidrawEditor.tsx`
Core editor component wrapping `@excalidraw/excalidraw`.

**Exposes:**
- `exportPNG()` — client-side PNG export (downloads blob)
- `onSave` callback — debounced auto-save (3s delay)
- Read-only mode (`viewModeEnabled`)

**Usage:**
```tsx
<ExcalidrawEditor
  boardId="board_xxx"
  initialData={{ elements: [], appState: {} }}
  onSave={(elements, appState) => saveToServer(elements, appState)}
/>
```

### `ExcalidrawEditorWrapper.tsx`
Error boundary around `ExcalidrawEditor`. Catches render errors and displays a fallback UI with restart option.

---

## API routes

### `GET /api/boards`
List boards for authenticated user.

### `POST /api/boards`
Create a new board.
```json
{ "title": "My Board" }
```

### `GET /api/boards/[id]`
Get a single board (must be owner or public board).

### `PUT /api/boards/[id]`
Update board elements/appState (auto-save endpoint).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Prisma) |
| `NEXTAUTH_SECRET` | ✅ | NextAuth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | Full URL of the app (e.g. `https://draw.craftisle.com`) |
| `GHOST_URL` | ❌ | Ghost CMS URL (for blog integration) |
| `GITHUB_CLIENT_ID` | ❌ | GitHub OAuth (optional auth provider) |
| `GITHUB_CLIENT_SECRET` | ❌ | GitHub OAuth secret |

---

## Database schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  boards    Board[]
}

model Board {
  id          String   @id @default(genId())
  title       String   @default("Untitled Board")
  user_id    String
  elements    Json      @default("[]")
  app_state   Json      @default("{}")
  is_public   Boolean  @default(false)
  updated_at  DateTime @default(now()) @updatedAt
  user        User      @relation(fields: [user_id], references: [id])
}
```

> `genId()` generates a 25-char random ID (see `src/lib/boards.ts`).

---

## Deployment

### Vercel (recommended)
1. Push to `main` → Vercel auto-deploys
2. Set environment variables in Vercel dashboard
3. Run `npx prisma migrate deploy` on first deploy

**Vercel Project ID:** `prj_FxD7gAKKCy7gmtu160zLey0Yu0TP`

### Docker (self-hosted)
```bash
docker build -t craftisle-draw .
docker run -p 3000:3000 --env-file .env.local craftisle-draw
```

---

## Troubleshooting

**Excalidraw worker fails to load:**
- Check `src/app/test-board/page.tsx` for worker debug info
- Verify `/api/excalidraw-worker` returns the correct blob URL

**Prisma client not found:**
- Run `npx prisma generate`
- Check `@prisma/client` is in `transpilePackages` in `next.config.js`

**Auth not working:**
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set

---

## Further reading

- [Excalidraw API docs](https://docs.excalidraw.com/)
- [NextAuth v4 docs](https://next-auth.js.org/)
- [Prisma docs](https://www.prisma.io/docs/)
