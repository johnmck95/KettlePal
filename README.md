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
  - [x] Knex/Apollo configuration
  - [x] DB migration files
  - [x] DB seed scripts
  - [x] Create Apollo/GQL Server
  - [x] Make basic CRUD Resolvers/Mutations
  - [x] Server-side validation for adding new workouts & exercises
- Frontend
  - [x] React/TypeScript/Chakra/Apollo Configuration
  - [x] Themeing/colors
  - [x] Create a form for entering new workouts/exercises with client side validation
  - [x] Create new-workout progress tracking while entering new workouts
  - [x] Create a modal to show details on a specific workout
  - [x] Get Progressive Web App downloadable for mobile.
  - [x] Implement swipable deletion for new exercises

### Roadmap

1. Login flow with JWT for the test account and myself
2. Allow editing of a past workout/exercise
3. Use D3 to create visualzations that provide genuine exercise insights
   - New page dedicated to progress tracking
   - Link relevant visualization in the workout modal for tracking
4. Integrate with Strava API to get data from bike rides and runs
