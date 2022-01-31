FROM node:lts-alpine3.15
ENV NODE_ENV=test
RUN apk add --no-cache nodejs
WORKDIR /home/node/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY .. .
EXPOSE 3000
CMD ["npm", "start"]
