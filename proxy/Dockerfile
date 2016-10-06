FROM siboulet/websockify

ENV PYTHONPATH "/app/plugins"

ADD ./plugins /app/plugins

EXPOSE 8081

CMD ["8081", "--token-plugin", "tokenpass.TokenPassPlugin"]