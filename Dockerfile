FROM bitnami/node:12-debian-10 as builder

LABEL org.opencontainers.image.authors="hipages DevOps Team <syd-team-devops@hipagesgroup.com.au>"

WORKDIR /app

COPY . ./

RUN npm install && \
    npm run build --if-present && \
    npm install --only=prod

FROM bitnami/node:12-debian-10-prod

COPY --from=builder /app /app

RUN useradd -u 1001 -r -g 0 -d /app -s /sbin/nologin -c "Default Application User" default && \
    chown -R 1001:0 /app

USER 1001

WORKDIR /app
EXPOSE 3000

ENV PORT=3000 \
    NODE_ENV=production

CMD ["npm", "start"]