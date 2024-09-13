## Welcome to KettlePal!

An overbuilt "just-for-me" learning project that is made to keep track of my personal kettlbell workouts. Designed primarily for mobile use.

[**Live Deploy Link**](https://main--kettlepal.netlify.app/) (_Very Early Prototype_)

## Languages and Tools

- Postgres
  - Hosted on Neon
- Apollo, GraphQL, TypeScript Backend Server
  - Hosted on Render
- React, TypeScript, ChakraUI Frontend
  - Hosted on Netlify

### Completed

- Infra
  - [x] Deployed DB, GQL Server & Frontend App
  - [x] Environment aware prod & local configurations
- Backend
  - [x] Design relational DB structure
  - [x] Knex/Apollo integration
  - [x] DB migration files
  - [x] DB seed scripts
  - [x] Create Apollo/GQL Server
  - [x] Make basic CRUD Resolvers/Mutations
  - [x] Server-side validation for adding new workouts & exercises
  - [x] JWT Token Authentication
- Frontend
  - [x] React/TypeScript/Chakra/Apollo Configuration
  - [x] Themeing/colors
  - [x] Create a form for entering new workouts/exercises with client side validation
  - [x] Create new-workout progress tracking while entering new workouts
  - [x] Create a modal to show details on a specific workout
  - [x] Get Progressive Web App downloadable for mobile.
  - [x] Implement swipable deletion for new exercises
  - [x] JWT Authentication, protected routes.
  - [x] Login form

### Roadmap

1. Allow editing of a past workout/exercise
2. Signup UI / password reset.
3. Use D3 to create visualzations that provide genuine exercise insights
   - New page dedicated to progress tracking
   - Link relevant visualization in the workout modal for tracking
4. Integrate with Strava API to get data from bike rides and runs
