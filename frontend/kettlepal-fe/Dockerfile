FROM node:21.7.1-alpine

WORKDIR /kettlepal-fe

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]