FROM node:15.11.0-buster

WORKDIR /src
COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_ENV

RUN npm run build


COPY entrypoint.sh /
ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "npx", "serve", "-s", "build" ]