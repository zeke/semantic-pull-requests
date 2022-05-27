FROM node:lts-alpine
RUN apk add --no-cache nodejs
WORKDIR /home/node/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY .. .
ENV APP_ID=168662
ENV WEBHOOK_PROXY_URL=https://semanticpr.shared.global.com/probot
EXPOSE 3000
CMD ["npm", "start"]
