# AR Soft BD

A full-stack agency website and content management system built for **AR Soft BD**. Manage the public marketing site, blog, portfolio, services, pricing, and dynamic pages from a modern admin dashboard — without touching code.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 19, Inertia.js 3 |
| Styling | Tailwind CSS v4 |
| Rich Text | Tiptap 3 |
| Database | SQLite (default) or MySQL / PostgreSQL |
| Media | Cloudinary (optional) + local fallback |
| Build | Vite 7 |

---

## Requirements

- **PHP** 8.2 or higher (with `sqlite3`, `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`)
- **Composer** 2.x
- **Node.js** 20+ and **npm** 10+
- **Cloudinary account** (recommended for production media uploads)

---

## Installation

### 1. Clone and install dependencies

```bash
git clone https://github.com/ahsan-ul-alam/digital_agency.git arsoftbd
cd arsoftbd

composer install
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

The project ships with **SQLite** by default. Ensure the database file exists:

```bash
touch database/database.sqlite
```

To use **MySQL** instead, update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arsoftbd
DB_USERNAME=root
DB_PASSWORD=
```

Set your application URL:

```env
APP_NAME="AR Soft BD"
APP_URL=http://localhost:8000
```

### 3. Database migration and seeding

```bash
php artisan migrate
php artisan db:seed
```

This creates the admin user, default site settings, homepage sections, sample services, portfolio items, blog posts, and more.

### 4. Build frontend assets

**Production:**

```bash
npm run build
```

**Development** (with hot reload):

```bash
npm run dev
```

### 5. Start the application

**Option A — Full dev stack** (server, queue, logs, Vite):

```bash
composer dev
```

**Option B — Manual:**

```bash
php artisan serve
# In a second terminal:
npm run dev
```

Open the site at [http://localhost:8000](http://localhost:8000).

### One-command setup

If you prefer a single setup script:

```bash
composer setup
```

This runs `composer install`, copies `.env`, generates the app key, migrates the database, installs npm packages, and builds assets.

---

## Default Admin Login

After seeding, sign in at `/login`:

| Field | Value |
|-------|-------|
| Email | `admin@arsoftbd.com` |
| Password | `password` |

**Change this password immediately in production.**

Admin dashboard: [http://localhost:8000/admin](http://localhost:8000/admin)

---

## Cloudinary Setup

Media uploads (library, page builder, rich text editor) work best with Cloudinary connected.

1. Create a [Cloudinary](https://cloudinary.com) account
2. Go to **Admin → Media Center → Cloudinary** (`/admin/cloudinary/settings`)
3. Enter:
   - Cloud Name
   - API Key
   - API Secret
   - Upload Preset (optional)
   - Folder (default: `arsoftbd`)
4. Click **Test Connection** to verify

When Cloudinary is connected:

- Images upload directly to your Cloudinary account
- The rich text editor uploads via `POST /admin/editor/upload`
- Public pages serve optimized responsive images (`f_auto`, `q_auto`)

Without Cloudinary, files are stored locally in `storage/app/public`.

---

## Features

### Public Website

- **Homepage** — hero, trusted logos, services, about, process, portfolio, pricing, testimonials, team, FAQ, blog, contact CTA
- **Services** — listing and detail pages with rich descriptions
- **Portfolio** — case study listings and project detail pages
- **Packages** — pricing tiers with feature lists
- **Blog** — categorized posts with SEO metadata
- **Contact** — inquiry form with admin lead management
- **Dynamic pages** — custom CMS pages built with AR Builder
- **SEO** — per-page meta tags, sitemap (`/sitemap.xml`), robots (`/robots.txt`)
- **Theme** — brand colors and gradients controlled from admin

### Admin Dashboard

A workflow-oriented CMS inspired by Notion, Stripe, and Linear:

- **Dashboard** — health checks, quick actions, recent activity
- **Command palette** — press `Ctrl+K` (or `Cmd+K`) to jump anywhere
- **Grouped navigation** — Website, Content, Services, Portfolio, Media, Marketing, SEO, System
- **Data tables** — sortable module indexes with search-friendly layouts
- **Schema-driven forms** — sectioned, card-based editing (no raw JSON for editors)

### Content Modules

| Module | Path | Description |
|--------|------|-------------|
| Homepage Sections | `/admin/homepage` | Hero, about, process, CTA blocks |
| Pages | `/admin/pages` | Static and dynamic pages |
| Services | `/admin/services` | Service cards and detail content |
| Portfolio | `/admin/portfolio` | Case studies and project stories |
| Packages | `/admin/packages` | Pricing plans and features |
| Blog | `/admin/blog` | Articles with categories and tags |
| Categories | `/admin/categories` | Blog taxonomy |
| Testimonials | `/admin/testimonials` | Client reviews and ratings |
| FAQs | `/admin/faqs` | Homepage accordion content |
| Team | `/admin/team` | Team member profiles |
| Logos | `/admin/logos` | Trusted-by client logos |
| Statistics | `/admin/statistics` | Hero counter stats |
| Inquiries | `/admin/contacts` | Form submissions |
| Media Library | `/admin/media` | Uploaded images and videos |

### AR Builder (Page Builder)

Visual page builder for dynamic pages, policy pages, landing pages, and careers content.

**Access:** `/admin/pages/{id}/builder`

**Block library includes:**

- **Basic** — heading, rich text, button, image, video, spacer, divider
- **Layout** — hero, content box, tabs, carousel, gallery
- **Marketing** — CTA, features, testimonials, counters, statistics
- **Interactive** — forms (shortcode embed), Google Maps, FAQ accordion

Each block has style controls (padding, background, alignment, columns, border radius, etc.).

**Admin edit bar:** When logged in as admin, a thin top bar appears on editable public pages with a direct link to AR Builder.

### Menus & Navigation

Manage from **Admin → Menus** (`/admin/menus`):

- Header navigation links
- Footer columns and links
- Header CTA button
- Footer logo visibility
- Social icons (URL or `#` = visible, blank = hidden)

### Rich Text Editor (Tiptap)

All major content fields use a professional rich text editor instead of plain textareas.

**Supported in:** pages, homepage sections, services, portfolio, blog, FAQs, testimonials, team bios, AR Builder blocks, and more.

**Editor features:**

- Text formatting — bold, italic, underline, strikethrough, highlight, superscript, subscript
- Headings — H1–H6
- Lists — bullet, numbered, checklist
- Blocks — quote, code (syntax highlighting), info/warning callouts
- Media — image upload to Cloudinary, drag & drop, paste
- Links — internal and external (open in new tab)
- Tables — insert responsive tables
- Embeds — YouTube, Google Maps
- UX — toolbar, bubble menu, slash commands (`/`), fullscreen, undo/redo, local draft autosave

**Frontend rendering:** HTML is sanitized with DOMPurify via `RichTextContent` for safe public display.

### Form Builder

Create custom forms at `/admin/forms` and embed them in AR Builder blocks using shortcodes. Submissions appear under **Leads & Inquiries**.

### Site & Theme Settings

| Setting | Path |
|---------|------|
| Company info, logo, contact, social | `/admin/site/settings` |
| Default SEO meta | `/admin/site/settings` |
| Brand colors and theme | `/admin/theme/settings` |
| Cloudinary credentials | `/admin/cloudinary/settings` |

---

## Project Structure

```
app/
├── Http/Controllers/
│   ├── Admin/          # Dashboard, CMS, media, menus, page builder
│   ├── Public/         # Public site and form submissions
│   └── AuthController.php
├── Models/             # Eloquent models (Service, BlogPost, Page, etc.)
├── Services/           # MediaStorageService (Cloudinary + local)
└── Support/            # AdminNavigation, MenuSettings, ThemePalette

resources/
├── js/
│   ├── Pages/
│   │   ├── Admin/      # Dashboard, ModuleForm, ArBuilder, settings
│   │   └── Public/     # Home, Listing, Detail, StaticPage, Contact
│   ├── Components/
│   │   ├── Cms/        # RichTextEditor, RichTextContent, form fields
│   │   ├── PageBuilder/# AR Builder blocks and inspector
│   │   └── Admin/      # Sidebar, command palette, data tables
│   └── Admin/          # moduleSchemas.js, icons
├── css/
│   └── app.css         # Public + admin design system
└── views/
    └── app.blade.php   # Inertia root template

database/
├── migrations/         # Schema definitions
└── seeders/            # Demo content and admin user

routes/
└── web.php             # Public routes, admin routes, catch-all pages
```

---

## Useful Commands

```bash
# Run tests
composer test
# or
php artisan test

# Fresh database with demo content
php artisan migrate:fresh --seed

# Production asset build
npm run build

# Code style (PHP)
./vendor/bin/pint

# Clear caches
php artisan optimize:clear
```

---

## Public Routes

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/about` | About page |
| `/services` | Services listing |
| `/services/{slug}` | Service detail |
| `/packages` | Pricing packages |
| `/portfolio` | Portfolio listing |
| `/portfolio/{slug}` | Project detail |
| `/blog` | Blog listing |
| `/blog/{slug}` | Blog post |
| `/contact` | Contact form |
| `/{slug}` | Dynamic CMS page |
| `/sitemap.xml` | XML sitemap |
| `/robots.txt` | Robots file |

---

## Production Deployment

1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Configure a production database (MySQL/PostgreSQL recommended)
3. Run `php artisan migrate --force`
4. Run `npm run build`
5. Link storage: `php artisan storage:link`
6. Cache config and routes:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
7. Configure a web server (Nginx/Apache) pointing to `/public`
8. Set up a queue worker if using queued jobs: `php artisan queue:work`
9. Connect Cloudinary for media delivery
10. Change the default admin password

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Site name shown in browser title |
| `APP_URL` | Full application URL |
| `DB_CONNECTION` | `sqlite`, `mysql`, or `pgsql` |
| `DB_DATABASE` | Database name or SQLite file path |
| `SESSION_DRIVER` | `database` (default) |
| `QUEUE_CONNECTION` | `database` (default) |
| `CACHE_STORE` | `database` (default) |

Cloudinary credentials are stored in the database via admin settings, not in `.env`.

---

## License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
