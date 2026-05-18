import requests

from django.conf import settings


def get_github_repos(username):

    url = f"https://api.github.com/users/{username}/repos"

    headers = {
        "Authorization": f"token {settings.GITHUB_TOKEN}"
    }

    response = requests.get(
        url,
        headers=headers
    )

    return response.json()