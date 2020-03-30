# Magi Shift Keycloak

Magishift is Low-Code Framework, helps you to build application easier, faster and a more efficient use of time. By using magishift it doesn’t matter whether you have software engineer background or not to start deploy your application.

## To start example app

### Prerequisites

- Make sure you have docker with docker-compose installed properly in your machine
- Make sure you have node with npm or yarn in your machine.

### Start Docker Container

```
docker-compose up -d
```

### Run the app

using npm:

```
npm install
npm run start
```

using yarn:

```
yarn install
yarn start
```

### Run the serverless offline

using npm:

```
npm run sls:offline
```

using yarn:

```
yarn sls:offline
```


check api endpoint
`http://localhost:{PORT}`

## Database migration
Migration will bw done automatically, when you have changes in .entity.ts file database will change accordingly

## Code of conduct

- Never create feature/module that specific to one project
- Always create interface and abstraction layer
- If you unsure always ask, cause if you break something here means other project will break
- Always create unit test properly
