FROM node:12-slim

WORKDIR /home/node/app
ADD package.json yarn.lock ./

RUN npm i -g yarn && yarn

USER node