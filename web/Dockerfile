FROM armhfbuild/nginx

COPY ./src /app
COPY bower.json /app/bower.json

WORKDIR /app
RUN apt-get -qy update && apt-get -qy install nodejs npm git && \
    npm install -g bower && ln -s /usr/bin/nodejs /usr/bin/node && \
    bower --allow-root install && \
    rm bower.json

COPY nginx.conf /etc/nginx/conf.d/default.conf
