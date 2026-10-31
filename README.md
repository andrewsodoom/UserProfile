# User Profile

A small Node.js/Express web app that displays an editable user profile. Profile data (name, email, interest) is stored in MongoDB.

## Features

- Serve a static profile page with a profile photo
- Load the saved profile from MongoDB on page load
- Edit and save profile fields through a simple form
- Fallback defaults when no profile exists yet

## Tech Stack

- [Node.js](https://nodejs.org/) / [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (via the `mongodb` driver)
- Vanilla HTML/CSS/JavaScript front end
- Docker / Docker Compose for local dependencies

## Project Structure

```
userprofile/
├── index.html        # Profile page (view + edit forms, client-side logic)
├── server.js         # Express server and API routes
├── images/           # Profile images served at /images/:filename
├── Dockerfile        # Image for running the app
├── mongo.yaml        # Docker Compose stack: MongoDB + mongo-express
├── .env              # MONGODB_URI connection string
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB running locally, or Docker

### 1. Start MongoDB

```bash
docker compose -f mongo.yaml up -d
```

This starts MongoDB on port `27017` (user `admin` / password `password`) and mongo-express on http://localhost:8081.

### 2. Install dependencies

```bash
npm install
```

> Note: `server.js` requires `body-parser`, which is not listed in `package.json`. Install it with `npm install body-parser` if it is missing.

### 3. Configure environment

Create or update `.env`:

```
MONGODB_URI=mongodb://admin:password@localhost:27017/my-db?authSource=admin
```

The server reads `MONGODB_URI` from the environment. If unset, it falls back to the same local connection string.

### 4. Run the app

```bash
npm start
```

The app is available at http://localhost:3000.

## API

| Method | Route             | Description                                      |
| ------ | ----------------- | ------------------------------------------------ |
| `GET`  | `/`               | Serves `index.html`                              |
| `GET`  | `/images/:filename` | Serves a JPEG from the `images/` directory     |
| `GET`  | `/get-profile`    | Returns the saved profile for `userid: 1`        |
| `POST` | `/update-profile` | Upserts the profile (JSON body: `name`, `email`, `interest`) |

### Example

```bash
curl -X POST http://localhost:3000/update-profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","interest":"Design"}'
```

## Docker

Build and run the app image:

```bash
docker build -t userprofile .
docker run -p 3000:3000 --env-file .env userprofile
```

When running the app in a container, `localhost` in `MONGODB_URI` refers to the container itself. Point it at the MongoDB service/host instead (e.g. `mongodb://admin:password@mongodb:27017/my-db?authSource=admin` if both are on the same Compose network).

## Notes

- Profiles are stored in the `users` collection of the `my-db` database.
- Only the profile with `userid: 1` is currently read/written.
- Uploaded/edited profile photos are not supported; the image is static.

## License

ISC
