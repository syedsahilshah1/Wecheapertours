# Egypt Travel | WeCheaperTours

A full-stack travel and tourism web application built with a **Laravel REST API** backend and a **React.js + Vite** frontend.

Designed for exploring Egypt destinations, day excursions, 5-star Nile cruise itineraries, chauffeured car rentals, ferry route assistance, vacation homes, personal concierge, and event planning. Customers can submit enquiries with automated reference code generation, contact local coordinators via WhatsApp, and administrators can manage all content through a protected admin dashboard.

---

## 🏛️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Public website & CMS dashboard |
| **Styling** | Tailwind CSS v4 | Responsive mobile/desktop design & custom Egyptian gold theme |
| **Icons** | Lucide React | High quality icons |
| **Routing** | React Router v7 | Public and admin protected routes |
| **HTTP Client** | Axios | Centralized client with Sanctum Bearer token interceptor |
| **Backend API** | Laravel 12 REST API | Versioned endpoints (`/api/v1`) |
| **Authentication** | Laravel Sanctum | Token-based administrator auth |
| **Database** | MySQL / SQLite | Migrations, Eloquent models, relationships, soft deletes |
| **File Storage** | Laravel Storage | Uploaded media stored in `storage/app/public` with public symlink |

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`backend/`)

```bash
cd backend

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Run database migrations and seed realistic Egypt travel data
php artisan migrate --seed

# Create storage symlink
php artisan storage:link

# Start Laravel development server
php artisan serve --port=8001
```

The Laravel REST API will run at `http://127.0.0.1:8001/api/v1`.

### 2. Frontend Setup (`frontend/`)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev -- --port 5173
```

The React frontend will be accessible at `http://localhost:5173`.

---

## 🔐 Administrator Access

- **Admin Login URL:** `http://localhost:5173/admin/login`
- **Default Email:** `admin@wecheapertours.com`
- **Default Password:** `admin123456`

---

## 🗺️ Website Routes

### Public Pages
- `/` — Homepage (Hero, 7 service categories, Nile cruises, destinations, trust badges, WhatsApp CTA)
- `/about` — About WeCheaperTours (Story, licensed guides, standards, FAQ)
- `/services` — All active services + "Under Preparation / Coming Soon" section
- `/excursions` — Excursions and day tours (Filterable by 7 destinations)
- `/excursions/:slug` — Single excursion itinerary details, highlights, inclusions, exclusions, and quote request
- `/nile-cruises` — Classic Nile cruise itineraries (Luxor → Aswan, Aswan → Luxor, Roundtrip 7N/8D)
- `/car-rentals` — Private car rentals across 7 destinations (with/without driver option)
- `/ferry-crossings` — Ferry routes (Taba ⇄ Aqaba, Hurghada ⇄ Sharm El-Sheikh) with verified schedule notice
- `/vacation-rentals` — Serviced apartments, penthouses, and villas across Egypt
- `/concierge` — Personal concierge services (The 9 specializations: food, groceries, laundry, cotton, shopping)
- `/events` — Event planning & celebrations (The 6 offerings: pyramid dinners, anniversaries, cruises)
- `/contact` — Contact details and general enquiry form
- `/privacy-policy` — Privacy policy
- `/terms` — Terms and conditions with explicit business scope disclosure
- `/404` — Not found page

### Admin Dashboard Pages (`/admin`)
- `/admin` — KPI overview cards (Total, New, In Progress, Resolved Enquiries, Published listings, Destinations) + recent enquiries table
- `/admin/enquiries` — Review, search, filter customer enquiries, change status, add internal notes, soft delete
- `/admin/destinations` — CRUD destinations with main image, summary, and SEO metadata
- `/admin/tours` — CRUD excursion day tours and Nile cruise itineraries
- `/admin/rental-options` — CRUD car fleet and vacation home options
- `/admin/concierge` — Manage the 9 concierge services
- `/admin/events` — Manage the 6 event offerings
- `/admin/services` — Manage primary service categories
- `/admin/media` — Upload images (JPEG, PNG, WebP < 10MB), copy URLs, manage media library
- `/admin/settings` — Update company details, WhatsApp number, phone, email, and disclaimers
- `/admin/users` — Administrator user management

---

## ⚡ Important Business Rules & Scope

1. **Informational & Enquiry Based:** Car rentals, ferry crossings, vacation rentals, concierge services, and event planning operate on an informational and enquiry basis. Submitting an enquiry does not claim a confirmed booking.
2. **Services Under Preparation:** Package tours, Dahabiya luxury sailboats, felucca expeditions, and scuba diving packages are presented under clearly labelled "Coming Soon / Under Preparation" sections rather than active booking services.
3. **Ferry Routes:** No fabricated schedules are displayed; all routes clearly inform travelers that schedules and crossings are verified manually with port authorities.
4. **Unique Reference Numbers:** Enquiries automatically receive unique references formatted as `WT-YYYY-XXXXXX` (e.g. `WT-2026-440871`).
