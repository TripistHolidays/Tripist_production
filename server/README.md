# Tripist Admin Backend

Node.js + Express + PostgreSQL API for the Tripist admin panel: banners, packages,
contact info, the site notice, login, password change, and admin user management.

## 1. Install

```bash
cd tripist-admin-backend
npm install
```

## 2. Configure

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and a strong `JWT_SECRET`.

## 3. Create the database and tables

```bash
createdb tripist_admin        # or create it in pgAdmin / psql
psql "$DATABASE_URL" -f schema.sql   # or: psql -U postgres -d tripist_admin -f schema.sql
```

## 4. Seed the first admin login

```bash
npm run seed
```

This creates the user set in `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`
(defaults: `admin` / `password123`) with role `superadmin`. **Log in and change
this password immediately** using the Users & Security tab.

## 5. Run the server

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API listens on `http://localhost:5000` by default.

## API overview

| Method | Route                        | Auth        | Purpose                          |
|--------|-------------------------------|-------------|-----------------------------------|
| POST   | /api/auth/login                | none        | Log in, returns JWT               |
| GET    | /api/auth/me                   | required    | Current user info                 |
| PUT    | /api/auth/change-password      | required    | Change your own password          |
| GET    | /api/users                     | required    | List admin users                  |
| POST   | /api/users                     | superadmin  | Add a new admin user              |
| DELETE | /api/users/:id                 | superadmin  | Remove an admin user               |
| GET    | /api/banners                   | none        | List banners                      |
| POST   | /api/banners                   | required    | Create banner                     |
| PUT    | /api/banners/:id                | required    | Update banner                     |
| DELETE | /api/banners/:id                | required    | Delete banner                     |
| GET    | /api/packages                  | none        | List packages (supports ?sort=&order=) |
| POST   | /api/packages                  | required    | Create package                    |
| PUT    | /api/packages/:id                | required    | Update package                    |
| DELETE | /api/packages/:id                | required    | Delete package                    |
| GET    | /api/contact                   | none        | Get contact info                  |
| PUT    | /api/contact                   | required    | Update contact info               |
| GET    | /api/notice                    | none        | Get site notice                   |
| PUT    | /api/notice                    | required    | Update site notice                |
| POST   | /api/upload                    | required    | Upload an image, returns { url }  |

All "required" routes expect `Authorization: Bearer <token>` from `/api/auth/login`.

## Notes

- Passwords are hashed with bcrypt (12 rounds); plaintext is never stored.
- `contact_info` and `notices` are single-row "settings" tables (id is always 1).
- Uploaded images are stored on disk under `/uploads` and served statically at
  `/uploads/<filename>`; swap `middleware/upload.js` for S3/Cloudinary if you'd
  rather not use local disk storage in production.
- Add rate limiting (e.g. `express-rate-limit`) on `/api/auth/login` before
  deploying publicly.
