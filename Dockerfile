
FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json package.json
RUN npm install
ADD . /usr/src/app

WORKDIR /usr/src/app

EXPOSE 8080
CMD ["node", "app.js"]
