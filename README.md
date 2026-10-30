# przegladarkaFilmow

A personal movie browsing application built with Next.js. It pulls data from [The Movie Database (TMDB)](https://www.themoviedb.org/) API and lets you keep track of what you want to watch and what you've already seen.

## What it does

The home page shows three curated lists fetched directly from TMDB: best rated movies, most popular right now, and the latest releases. Clicking any title opens a detail page with the full overview, runtime, genres, director, top cast, and the TMDB community rating.

If you create an account, you can add movies to a personal watchlist or mark them as watched. Both lists are available as separate pages so you can manage them easily. Adding a movie you've already marked as "to watch" will move it over to your watched list.

## Tech stack

- **Next.js 16** with the App Router and React 19
- **TypeScript** throughout
- **NextAuth** for session-based authentication
- **Prisma** with a SQLite database for storing user data and movie lists
- **Tailwind CSS** for styling
- **bcrypt** for password hashing

## Getting started

Install dependencies:

```bash
npm install
```

Set up the database:

```bash
npx prisma migrate dev
```

You'll need a TMDB API key. The app currently reads it directly in the fetch calls — swap in your own key or move it to an environment variable.

Create a `.env` file at the project root and add at minimum:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
  app/
    page.tsx              # Home page (movie lists)
    movie/[id]/           # Movie detail page
    login/                # Login page
    register/             # Registration page
    watchedMovies/        # Your watched movies list
    toWatchMovies/        # Your watchlist
    api/                  # API routes (auth, movie lists)
  components/             # Shared UI components
  types/                  # TypeScript type definitions
  lib/                    # Prisma client setup
prisma/
  schema.prisma           # Database schema
```

## Notes

- Movie data is fetched client-side from the TMDB API in Polish (`pl-PL` locale).
- The database stores only TMDB movie IDs linked to user accounts — no movie metadata is duplicated locally.
- Passwords are hashed with bcrypt before being stored.
