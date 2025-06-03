FROM node:20.17.0-alpine3.20 as build

RUN apk add --no-cache --update \
            python3 \
            make \
            g++ \
            krb5-dev \
            bash && \
    rm -rf /tmp/* /var/tmp/* 

WORKDIR /app

ARG TYPE_SERVER
ENV TYPE_SERVER="$TYPE_SERVER"

COPY package-$TYPE_SERVER.json ./package.json
COPY yarn.lock ./

COPY $TYPE_SERVER/package.json ./$TYPE_SERVER/

RUN yarn install

COPY $TYPE_SERVER/ ./$TYPE_SERVER/
COPY shared/ ./shared/

RUN cd $TYPE_SERVER && yarn build

WORKDIR /app/$TYPE_SERVER
EXPOSE 3002 4173

CMD /bin/bash -c '\
    if [ "$TYPE_SERVER" = "backend" ]; then \
        exec yarn workspace backend start:prod; \
    elif [ "$TYPE_SERVER" = "frontend" ]; then \
        exec yarn preview --host; \
    else \
        echo "Unknown TYPE_SERVER: $TYPE_SERVER"; \
        exit 1; \
    fi'
