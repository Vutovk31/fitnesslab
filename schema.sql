# API Reference

## Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

## Users / Profiles
- GET /users/me
- PATCH /profiles/me
- POST /profiles/avatar

## Programs / Workouts
- GET /programs/current
- GET /workouts
- GET /workouts/:id
- POST /workouts/:id/complete

## Progress / Measurements
- GET /progress
- POST /progress
- GET /measurements
- POST /measurements

## Nutrition
- GET /nutrition/targets
- POST /nutrition/calculate
