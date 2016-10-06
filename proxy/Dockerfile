FROM siboulet/websockify

ENV PYTHONPATH "/app/plugins"

ADD ./plugins /app/plugins

CMD ["8080", "--token-plugin", "tokenpass.TokenPassPlugin"]