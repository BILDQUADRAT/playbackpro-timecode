#!/env/python3

from websockify.token_plugins import BasePlugin


class TokenPassPlugin(BasePlugin):
    def lookup(self, token):
        params = token.split(':')
        if len(params) == 2:
            return params
        return None
