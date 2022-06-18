FROM node:16

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm --verbose install

COPY . /usr/src/bot


CMD ["npm", "start"]