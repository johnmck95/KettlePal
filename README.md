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
  - [x] Create DB migration files
  - [x] Create DB seed script
  - [x] Create Apollo/GQL Server
  - [x] Make basic CRUD Resolvers/Mutations
- Frontend
  - [x] React/TypeScript/Chakra/Apollo Configuration
  - [x] Build the page structure
  - [x] Themeing/colors
  - [x] Setup a page for viewing past workouts/exercises
  - [x] Setup a page for entering new workouts/exercises
  - [x] Allow mid-workout progressd tracking
  - [x] Get Progressive Web App downloadable for mobile.
  - [x] Implement swipable deletion for new exercises

### Roadmap

1. Login flow with auth tokens for the test account and myself
2. Make the current UI actually look nice 😂
3. Make past workouts open a modal with full details
4. Create mutation to edit a posted workout
5. Use D3 to create visualzation that provide genuine exercise insights
