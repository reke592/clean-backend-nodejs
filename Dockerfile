ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY ./package*.json .
RUN npm ci

COPY ./src ./src
COPY ./.env.sample .
COPY ./config/default.json ./config/default.json

# production | development | test
ENV NODE_ENV=production

ENV SERV_PORT=4000
ENV CLUSTER_SIZE=1
ENV TRUST_PROXY=1
#DEBUG=app*

ENV CRON_AS_DAEMON=true
ENV CRON_CHECK_STALE_USER_ACCESS="*/5 * * * * *"

# default logs/
ENV LOGS_DIR=
ENV LOG_MAX_SIZE=20m
# retention period in days or number of files
ENV LOG_RETENTION=14d
ENV LOG_FILENAME=app.log
ENV LOG_REQUESTS=false

# default data/
ENV DATA_DIR=

CMD ["sh", "-c", "npm run $NODE_ENV"]
