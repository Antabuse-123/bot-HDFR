FROM node:16.15.15

WORKDIR /usr/src/bot-HDFR

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]