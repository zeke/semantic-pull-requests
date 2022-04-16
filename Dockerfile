FROM node:16-slim

ARG NODE_ENV="production"
ENV NODE_ENV="$NODE_ENV"
ENV NO_UPDATE_NOTIFIER="true"

EXPOSE 3000/tcp

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production && \
    npm cache clean --force
COPY . .

USER nobody

CMD [ "npm", "start" ]
