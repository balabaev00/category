FROM node:20

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn run build

CMD ["yarn", "start"]

EXPOSE 3000
