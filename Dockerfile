FROM node:alpine

WORKDIR /pet-adoption-server

COPY . .

RUN npm install

EXPOSE 4000

CMD ["npm","start"]