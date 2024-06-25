FROM node:alpine

WORKDIR /pet-adoption-server

COPY . .

RUN npm install

CMD ["npm","start"]