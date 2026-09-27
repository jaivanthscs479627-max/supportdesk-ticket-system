# SupportDesk — Customer Support Ticket System

## Problem statement

Support requests can be difficult to track when customer details, issue descriptions, priorities, and follow-ups live in separate places. SupportDesk provides a simple interface for organizing customer tickets in one inbox.

## Project objective

Build a responsive, client-side support ticket manager that demonstrates React components, forms, validation, state management, CRUD operations, search, filtering, and browser storage without needing a backend or API key.

## Features

- Create, view, edit, and delete customer tickets.
- Track customer name and email, issue subject and description, category, priority, status, assigned agent, and timestamps.
- Search by ticket ID, customer name, email, or subject.
- Combine status, priority, and category filters; clear filters; sort by date or priority.
- Change ticket status directly from the detail view.
- Dashboard counts are calculated from current ticket data, with a recent ticket list.
- Form validation for required customer name, valid email, subject length, and description length.
- Confirmation dialog before deleting; toast feedback after create, edit, and delete actions.
- Responsive desktop sidebar, mobile navigation, and horizontally scrollable ticket table on small screens.
- Sample tickets on first launch and localStorage persistence across refreshes.

## Technologies used

- React and JSX with functional components
- JavaScript ES6+
- Vite development server and production bundler
- React Router for the dashboard, ticket list, create, edit, and detail routes
- Lucide icons
- HTML5 and CSS3

## React concepts demonstrated

- Components and props: `Dashboard`, `TicketsPage`, `TicketForm`, `TicketTable`, `StatCard`, `StatusBadge`, `PriorityBadge`, and dialog components are composed from smaller pieces.
- `useState`: owns tickets, form data, validation errors, filters, sort order, delete confirmation, and toast messages.
- `useEffect`: persists tickets to localStorage and displays route feedback after navigation.
- `useMemo`: recalculates the filtered and sorted ticket list when its inputs change.
- Conditional rendering: empty states, errors, edit-only fields, and confirmation dialogs respond to application state.
- Array methods: `map`, `filter`, `find`, `reduce`, and `some` support display, search/filtering, lookups, dashboard totals, ID generation, and safe deletion.
- ES6 modules, arrow functions, destructuring, template literals, optional chaining, and spread syntax.

## Application workflow

1. Open Dashboard to review ticket totals and recently updated requests.
2. Choose **Create ticket** and enter customer and issue information. The form validates the input before saving.
3. Open **All tickets** to search, combine filters, change sorting, or open a ticket.
4. Use ticket details to change status, edit the ticket, or delete it after confirmation.
5. Refresh the browser: saved tickets remain available on the same browser and origin.

## Folder structure

```text
support-ticket-system/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── Badges.jsx
    │   ├── ConfirmDialog.jsx
    │   ├── EmptyState.jsx
    │   ├── StatCard.jsx
    │   ├── TicketForm.jsx
    │   └── TicketTable.jsx
    ├── data/
    │   └── sampleTickets.js
    └── utils/
        └── ticketUtils.js
```

## Installation and running

Install Node.js 20.19+ or 22.12+, then from this folder run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Create a production build with `npm run build`; preview it with `npm run preview`.

## LocalStorage explanation

Tickets are stored under `supportdesk-tickets-v1`. On startup, the app safely parses and checks the saved value. If there is no saved list or the data is malformed, the sample tickets are used. A React effect writes the current ticket list back after changes. Data is local to the current browser and origin; clearing site data removes it.

## How This Project Meets the Assignment Requirements

| Requirement | Where it is demonstrated |
| --- | --- |
| React components | Reusable UI lives in `src/components/`; views and shared state are in `src/App.jsx`. |
| JSX | Components return semantic JSX throughout `src/`. |
| `useState` | `src/App.jsx` manages tickets, dialog, toast, and page controls; `TicketForm.jsx` manages form values and validation errors. |
| `useEffect` | `src/App.jsx` loads initial data through the state initializer, saves ticket changes, and responds to route feedback. |
| Form handling | `TicketForm.jsx` controls input values and handles submit events. |
| Validation | The form checks required name, email format, subject length, and description length before saving. |
| Interactive features | Create, edit, delete, status update, search, filters, sort, confirmation, and dashboard navigation are functional. |
| Three or more functional views | Dashboard, ticket list, create/edit form, and individual ticket details are routed views. |
| Responsive design | `src/App.css` includes tablet and mobile layouts, a mobile nav, and responsive ticket table overflow. |

## Important files for your viva

- `src/App.jsx` — routes, shared state, create/update/delete workflows, dashboard, list, and ticket details.
- `src/components/TicketForm.jsx` — controlled form, props, submit handler, and client-side validation.
- `src/utils/ticketUtils.js` — safe localStorage parsing, ticket IDs, filtering, date formatting, and statistics.
- `src/components/TicketTable.jsx` — reusable list rendering and action links.
- `src/data/sampleTickets.js` — starter data used on first launch.
- `src/App.css` — layout, badges, responsive breakpoints, and visual styling.

## Future enhancements

- Add a backend and user authentication for shared team access.
- Add pagination, ticket comments, and email notifications.
- Add charts for ticket volume and response times.
