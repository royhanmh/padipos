# Padipos

Simple, role-based point of sale for managing products, cashier transactions, and operational settings.

![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
![Frontend: React 19](https://img.shields.io/badge/frontend-React%2019-61DAFB)
![Backend: Express 5](https://img.shields.io/badge/backend-Express%205-000000)
![Database: PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo / Deployment](#live-demo--deployment)
- [Access Flow](#access-flow)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration / Environment Variables](#configuration--environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author / Acknowledgements](#author--acknowledgements)

## Overview

Padipos is a simple POS application built for small business operations, store counters, and internal retail workflows. It separates **admin** and **cashier** responsibilities so product management and transaction handling stay clean and role-specific.

The project solves the common need for a lightweight POS system that can:

- manage product catalogs and inventory
- support cashier transaction flow
- keep role-based access under one web application
- provide reporting and account settings in a practical interface

## Features

- Role-based access for **admin** and **cashier**
- JWT authentication stored in **HttpOnly cookies**
- Product catalog management for admins
- Cashier transaction flow with protected transaction APIs
- Sales reporting dashboard
- Profile and password settings
- Password reset flow for cashier accounts
- Export-ready reporting stack with `jsPDF`, `jspdf-autotable`, and `xlsx`
- Responsive UI for desktop and mobile workflows

## Live Demo / Deployment

**Live app:** [https://padipos.vercel.app/](https://padipos.vercel.app/)

From the deployed app, users can:

- open the login flow for admin or cashier access
- browse the dashboard UI
- manage products, transactions, and settings based on their role

## Access Flow

1. User visits [https://padipos.vercel.app/](https://padipos.vercel.app/).
2. User signs in as **admin** or **cashier**.
3. Backend authenticates the account and stores the session using a **JWT in an HttpOnly cookie**.
4. Admin is redirected to the dashboard area to manage products and settings.
5. Cashier is redirected to the cashier workflow to handle transactions and sales activity.
6. Protected requests use the session cookie automatically.
7. User logs out, and the auth cookie is cleared.

### Local / Demo Seed Accounts

Development seed credentials are available after running the database seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@possederhana.com` | `admin123` |
| Cashier | `kasir@possederhana.com` | `kasir123` |

These credentials are intended for **local/demo use only**.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd pos-sederhana
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create environment files for backend and frontend before running the app.

### 5. Run database migration and seed

```bash
cd ../backend
npm run db:migrate
npm run db:seed:all
```

## Usage

### Run backend locally

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:4000` by default.

### Run frontend locally

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Production-style commands

```bash
# backend
cd backend
npm start

# frontend
cd frontend
npm run build
npm run preview
```

## Configuration / Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT sessions |
| `JWT_EXPIRES_IN` | No | JWT lifetime, defaults to `24h` |
| `DB_SSL_REJECT_UNAUTHORIZED` | No | Set to `false` when SSL cert verification must be relaxed |
| `FRONTEND_ORIGIN` | No | Allowed frontend origin for CORS, defaults to `http://localhost:5173` |
| `PORT` | No | Backend port, defaults to `4000` |

Example backend `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/padipos
JWT_SECRET=change-me
JWT_EXPIRES_IN=24h
DB_SSL_REJECT_UNAUTHORIZED=false
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | API base URL, defaults to `http://localhost:4000/api` |

Example frontend `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Project Structure

```text
pos-sederhana/
|- backend/
|  |- src/
|  |  |- handlers/
|  |  |- middlewares/
|  |  |- models/
|  |  |- routes/
|  |  `- db/
|  `- postman/
|- frontend/
|  |- src/
|  |  |- components/
|  |  |- features/
|  |  |- layouts/
|  |  |- pages/
|  |  |- routes/
|  |  `- stores/
`- design-system.md
```

## API Reference

Base URL (local): `http://localhost:4000/api`

### Health

- `GET /health` - backend health check

### Auth

- `POST /auth/admin/login`
- `POST /auth/admin/register`
- `POST /auth/cashier/login`
- `POST /auth/cashier/register`
- `POST /auth/cashier/request-reset-password`
- `POST /auth/cashier/reset-password`
- `GET /auth/me`
- `PATCH /auth/me`
- `PATCH /auth/me/password`
- `POST /auth/logout`

### Products

- `GET /products` - public product list
- `GET /products/:uuid` - public product detail
- `POST /products` - admin only
- `PATCH /products/:uuid` - admin only
- `DELETE /products/:uuid` - admin only

### Transactions

- `GET /transactions` - authenticated user
- `GET /transactions/:uuid` - authenticated user
- `POST /transactions` - cashier only

Postman assets are available in [`backend/postman`](./backend/postman).

## Testing

This repository does not currently ship with a dedicated automated test suite.

Current validation is done through:

- frontend build checks via `npm run build`
- linting via `npm run lint` in the frontend
- backend migration/seed flow
- manual API and UI verification

## Roadmap

- Add automated API and UI tests
- Improve deployment and CI visibility
- Expand reporting and export workflows
- Add more operational controls for store management

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused, well-documented changes.
4. Run relevant local checks before opening a pull request.
5. Submit a PR with a clear summary of what changed and why.

For larger changes, open an issue first to discuss scope and implementation direction.

## License

This project is licensed under the **ISC License**.

## Author / Acknowledgements

Created and maintained by **royhanmh**.

If you use Padipos as a base for your own POS workflow, consider crediting the project and contributing improvements back to the repository.
