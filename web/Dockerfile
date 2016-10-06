FROM nginx:alpine

COPY ./src /app
COPY bower.json /app/bower.json

WORKDIR /app
RUN apk --update add ca-certificates curl git && \
    curl -L -q -o /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-node-bower/master/sgerrand.rsa.pub && \
    curl -L -O https://github.com/sgerrand/alpine-pkg-node-bower/releases/download/1.7.9-r0/node-bower-1.7.9-r0.apk && \
    apk --update add node-bower-1.7.9-r0.apk && \
    bower --allow-root install && \
    rm bower.json

COPY nginx.conf /etc/nginx/conf.d/default.conf