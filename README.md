# Nixora Monorepo

This repository contains the monorepo scaffold for the Nixora ecommerce marketing platform. It provides a baseline setup for building a drag-and-drop experience studio, publishing pipelines, and management tooling across web and backend services.

## Tech Stack Overview

- **Package management:** pnpm with Turborepo orchestrating tasks
- **Frontend:** React, TypeScript, Tailwind CSS — all powered by Vite for a consistent tooling story
- **Backend:** NestJS REST API
- **Shared packages:** Centralized UI components and utilities to be shared across applications

## Project Structure

```
├── apps
│   ├── studio             # Drag-and-drop builder & campaign operations hub (Vite + React)
│   └── api                # NestJS backend services
├── packages
│   ├── ui                 # Shared React component library
│   └── utils              # Reusable TypeScript utilities
├── exports                # Placeholder for generated campaign projects
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # pnpm workspace definition
└── turbo.json             # Turborepo pipeline
```

### Why a single frontend application?

- **Studio (Vite + React):** The Studio unifies the page builder and the operational dashboards. Designers compose experiences, configure data bindings, and trigger publish jobs without leaving this workspace.

Published assets will be emitted as self-contained projects inside the `exports/` folder. The long-term plan is to compile each Studio publish into a ready-to-deploy artifact (for example, a Next.js project with the generated page code and configuration). Keeping one canonical frontend keeps shared state and tooling simple while allowing the pipeline to output any number of generated runtimes.

## Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run all development servers in parallel**

   ```bash
   pnpm dev
   ```

   Individual apps can also be run from their respective directories, e.g. `pnpm dev --filter studio`.

3. **Build all projects**

   ```bash
   pnpm build
   ```

4. **Lint all projects**

   ```bash
   pnpm lint
   ```

## Next Steps

- Expand the drag-and-drop builder with actual page composition logic.
- Define build pipelines for publishing marketing pages as standalone deployments.
- Implement authentication, analytics, and content management APIs in the NestJS backend.
- Flesh out shared UI components and utilities as the platform evolves.

