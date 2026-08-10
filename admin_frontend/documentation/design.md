# Hotel Management System (HMS) Admin Panel — Design System & UI Specification

## 1. Overview & Design Vision
This document defines the comprehensive visual identity, UI design principles, layout architecture, and component standards for the Hotel Management System (HMS) Admin Panel. 

The goal is to transform the existing interface into a **sleek, high-end, modern boutique-hotel management dashboard**. The interface must feel effortless, clean, visually engaging, and highly functional for daily hotel operations.

---

## 2. Design Principles & Guidelines
* **No Emojis as UI Icons:** All UI icons must strictly use official vector icon libraries (e.g., `Lucide Icons`, `Heroicons`, or `Tabler Icons`).
* **Component-First Architecture:** Leverage established UI component primitives (e.g., `shadcn/ui`, `Radix UI`, `Tailwind CSS`) for consistent borders, shadows, focus states, and rounded corners (`rounded-xl` / `rounded-lg`).
* **Visual Hierarchy & Whitespace:** Use clean typography, generous padding, and subtle container borders (`border border-slate-200 / border-slate-800`) rather than heavy backgrounds or harsh dividers.
* **Operational Density:** Balance aesthetic elegance with data density. Hotel staff need quick visibility into room availability, guest check-ins, and key metrics without clutter.

---

## 3. Typography & Color Palette

### Typography
* **Primary Sans-Serif:** `Inter` or `Plus Jakarta Sans`
* **Numeric / Data Displays:** `JetBrains Mono` or tabular figures (`font-mono` / `tabular-nums`) for currency, room numbers, and dates.
* **Scale:**
  * Page Title: `text-2xl font-bold tracking-tight`
  * Section Heading: `text-lg font-semibold`
  * Card Label / Metric: `text-xs font-medium text-slate-500 uppercase tracking-wider`
  * Body / Table Text: `text-sm font-normal text-slate-700`

### Color System (Light & Dark Theme Compatible)
* **Brand / Accent Colors:**
  * Primary Accent: Deep Indigo / Navy (`#1E293B` / `#0F172A` or `#2563EB`)
  * Luxury Accent: Muted Gold / Warm Sand (`#D97706` / `#F59E0B`) for VIP status or highlight badges.
* **Neutral Tones:**
  * Background: `#F8FAFC` (Slate-50) / `#090D16` (Dark Slate)
  * Card / Panel Surface: `#FFFFFF` / `#1E293B`
  * Borders: `#E2E8F0` / `#334155`
* **Operational Status Palette (Hotel Specific):**
  * **Occupied / In-House:** Soft Red / Rose (`bg-rose-50 text-rose-700 border-rose-200`)
  * **Available / Vacant:** Soft Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  * **Cleaning / Housekeeping:** Amber Yellow (`bg-amber-50 text-amber-700 border-amber-200`)
  * **Reserved / Incoming:** Sky Blue (`bg-sky-50 text-sky-700 border-sky-200`)
  * **Out of Order (OOO):** Neutral Slate (`bg-slate-100 text-slate-600 border-slate-300`)

---

## 4. Iconography Standards
Replace all hardcoded emoji icons with high-quality SVG vector icons (e.g., `lucide-react`).

### Icon Mapping Table
| Section / Feature | Recommended Lucide Icon Name | Visual Usage |
| :--- | :--- | :--- |
| Dashboard | `LayoutDashboard` | Sidebar navigation |
| Rooms / Inventory | `BedDouble` / `DoorOpen` | Room management section |
| Reservations | `CalendarDays` / `BookmarkCheck` | Booking calendar & timeline |
| Guests | `Users` / `UserCheck` | Guest CRM and history |
| Housekeeping | `Sparkles` / `SprayCan` | Cleaning status & maintenance |
| Billing & Invoice | `Receipt` / `CreditCard` | Financial transactions |
| Analytics / Reports | `BarChart3` / `TrendingUp` | Occupancy & RevPAR reports |
| Settings | `Settings` / `Sliders` | System configuration |
| Check-in / Check-out | `LogIn` / `LogOut` | Action buttons |
| Search | `Search` | Global header search |
| Notifications | `Bell` | Header alert counter |

---

## 5. UI Layout & Component Specifications

### 5.1 Main Layout Shell
* **Sidebar Navigation:**
  * Fixed left sidebar (`w-64`), collapsible to mini-icon bar (`w-20`).
  * Brand logo top header with hotel name and selector dropdown.
  * Active link state: Solid fill accent background (`bg-slate-900 text-white` or `bg-blue-50 text-blue-600 font-semibold`).
  * User profile footer with avatar, name, role badge (Admin / Receptionist), and quick logout menu.
* **Top Navigation Bar:**
  * Breadcrumb track for deep navigation (`Home / Rooms / Executive Suite 302`).
  * Universal search bar (`Cmd + K` trigger) searching reservation ID, guest name, or room number.
  * Live status pill showing Current Occupancy % and Today's Check-ins count.
  * Notification bell badge and dark/light mode toggle switch.

### 5.2 Key Dashboard Widgets & Cards
1. **Key Performance Indicator (KPI) Stat Cards:**
   * Grid of 4 cards: **Occupancy Rate**, **ADR (Average Daily Rate)**, **RevPAR (Revenue Per Available Room)**, and **Today's Arrivals/Departures**.
   * Include sparkline mini-charts or percentage trend badges (`+12.5% vs last week` with `TrendingUp` icon).
2. **Interactive Room Status Matrix (Grid View):**
   * Visual room grid categorized by floor or room type.
   * Each room tile displays: Room Number, Type Badge, Guest Name (if occupied), Status Badge, and Quick Action Hover Menu (`Check In`, `Mark Clean`, `View Details`).
   * Color-coded top bar on each tile indicating cleaning/occupancy state.
3. **Live Booking Timeline / Gantt Chart:**
   * Horizontal date scroll view showing room allocation across dates.
   * Expandable reservation bars with clear status indicators.
4. **Data Tables (Reservations & Guests):**
   * Clean table headers with subtle background fill.
   * Filter bars: Date range selector, status dropdown, search input.
   * Row hover effects (`hover:bg-slate-50`).
   * Pagination bar with item count and page controls.

---

## 6. Micro-Interactions, States & UX Refinements
* **Empty States:** Custom styled empty state illustrations/vectors with actionable standard buttons (e.g., "No active check-ins found.").
* **Loading Skeletons:** Use animated pulses (`animate-pulse`) for cards and table rows during data fetching instead of generic loading spinners.
* **Modals & Slide-overs:** Standardize quick check-in and booking creation into right-side slide-over drawers or centered frosted glass backdrop modals (`backdrop-blur-sm`).
* **Toast Notifications:** Standardize toast alerts for system actions using UI feedback libraries (e.g., `sonner`).

---

## 7. Implementation Checklist for AI / Code Generator
- [ ] Replace all emojis with `Lucide` / vector icon components.
- [ ] Apply unified CSS styling using the provided color tokens and spacing rules.
- [ ] Refactor layout into clean sidebar, top bar, and main content area components.
- [ ] Replace basic tables with styled, filterable data tables featuring status badges.
- [ ] Standardize form controls (inputs, select dropdowns, date pickers) with consistent focus rings and rounded borders.
- [ ] Ensure full responsiveness across desktop, tablet, and mobile views.
