# Rahul Lamani — portfolio

A minimal editorial portfolio for Python, AI systems, and machine-learning work.
Built with React 19, TypeScript, and Vite. No UI framework, no analytics, no
cookie banner.

## What is in here

- **Hero** — identity, terminal card, atmospheric glyph field.
- **Selected work** — four verified GitHub projects with animated, expandable
  case studies. Each case study opens with a live structure diagram.
- **Lab** — an interactive A* search on an occupancy grid, implemented in
  TypeScript and tested with Vitest. It is explicitly labelled as a browser
  reimplementation, not the ATLAS Python code.
- **Notes** — short engineering notes tied to their repositories.
- **Contact** — email, phone, and GitHub links.

All project claims are based on the public repositories. Nothing is measured or
deployed unless the repository says so.

## Requirements

- Node.js 22+
- npm

## Development

```bash
npm install
npm run dev
```

The dev server prints a local URL, usually `http://localhost:5173`.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` runs the TypeScript project build and writes a production
bundle to `dist/`.

## Preview the production build

```bash
npm run preview
```

## Deploy to GitHub Pages (free)

The repository includes `.github/workflows/deploy.yml`. Once the project is on
GitHub:

1. Push the code to a repository. The workflow expects the default branch to be
   `main`; edit `.github/workflows/deploy.yml` if yours is different.
2. In the repository, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.
4. The site is published at `https://<username>.github.io/<repository>/`.

`vite.config.ts` sets `base: './'`, so assets resolve correctly both at a
project URL such as `/portfolio/` and at a custom domain. You do not need to
change the base path for a repository named `<username>.github.io`.

The live site is currently at
[https://rahullamani01.github.io/portfolio/](https://rahullamani01.github.io/portfolio/).
The social preview and canonical URLs in `index.html` point at that address. If
you add a custom domain later, update those absolute URLs too.

The build is static. There is no server, database, or environment variable to
configure.

### Free hosting alternatives

- **GitHub Pages** — free for public repositories, custom domain supported.
- **Cloudflare Pages** — free tier, connect the repository, build command
  `npm run build`, output directory `dist`.
- **Netlify** — free tier, same build command and output directory.
- **Vercel** — free Hobby tier for personal projects, framework preset Vite.

All four deploy the same `dist/` directory. GitHub Pages is the lowest-friction
option here because the workflow is already included.

## Project structure

```
src/
  components/     shared UI, icons, diagrams, reveal wrapper
  content/        project, note, and contact data
  hooks/          reduced-motion and active-section hooks
  lib/            A* implementation and tests
  sections/       page sections
  styles/         design tokens and global CSS
public/           favicon, social preview, robots.txt
```

## Notes on the A* lab

The lab runs `findPath` from `src/lib/astar.ts`: an 8-connected A* search with
an octile heuristic. Diagonal moves are rejected when they would cut through a
wall corner. The same module powers the ATLAS case-study diagram. The ATLAS
Python implementation remains the reference and lives in
[rahullamani01/Atlas](https://github.com/rahullamani01/Atlas).

## License

Personal portfolio content and project copy: all rights reserved. The A*
implementation is available to read and learn from.
