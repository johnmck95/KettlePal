FROM node:21.7.1

WORKDIR /graphql-server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]