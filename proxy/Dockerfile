FROM armhfbuild/debian:wheezy

ENV PYTHONPATH "/app/plugins"

ADD websockify /app
ADD ./plugins /app/plugins
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends python python-numpy

ENTRYPOINT [ "./run" ]
