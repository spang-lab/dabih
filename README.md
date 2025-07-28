# Dabih data storage platform

- A secure way to upload and share data
- You decide who gets access to your data
- End-to-end encrypted, redundant data storage
- Simple to use

## Quickstart

Start a demo version of dabih:

```
    docker run -p 3000:3000 thespanglab/dabih:latest
```

## Development

- Install Node.js (https://nodejs.org/)
- Install Docker (https://www.docker.com/)
- Clone this repository

- Install dependencies

```
    cd dabih
    cd api
    npm install
    npm run dev:migrate
    cd ..
    cd next
    npm install
    npm run client
    cd ..
```

- Install Pm2

```
    npm install -g pm2
```

- Start the development environment

```
    ./start.sh
```

- Go to http://localhost:3000
