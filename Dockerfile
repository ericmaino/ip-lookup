FROM node:lts-alpine

RUN mkdir -p /home/raw-data
COPY data/* /home/raw-data/

RUN mkdir -p /home/app
WORKDIR /home/app
COPY package.json .
RUN npm install
COPY tsconfig.json .
COPY src ./src
RUN npm run build

ENV DATA_DIR=/home/raw-data
WORKDIR /home/app/release

CMD ["node", "server.js"]