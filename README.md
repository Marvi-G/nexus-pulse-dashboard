# Pulse Dashboard

A premium business analytics dashboard built with **Nuxt.js 3** and **TypeScript**. Fully typed, responsive, and designed with a focus on clean UI/UX.

## Tech Stack

- **Framework:** Nuxt.js 3
- **Language:** TypeScript
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Charts:** Chart.js + vue-chartjs
- **Testing:** Vitest + Vue Test Utils
- **Deployment:** Vercel

## Features

- **Authentication** — Mock JWT login with cookie-based sessions and route guards
- **Dashboard** — Summary stat cards, revenue line chart, orders bar chart, traffic doughnut chart
- **Analytics** — Date range filtering, category filtering, area/stacked bar/horizontal bar charts
- **Users** — Data table with 53 rows, sorting, search filtering, pagination, edit/delete modals
- **Settings** — Dark/light theme toggle, profile form, notification preferences, language selector
- **404 Page** — Clean fallback for unknown routes
- **Responsive** — Mobile-first layout with collapsible sidebar
- **Dark Mode** — CSS variable-based theming with localStorage persistence
- **Tested** — 42 Vitest unit tests across components, stores, and utilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nuxt-analytics-dashboard.git

cd nuxt-analytics-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```
