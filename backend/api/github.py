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

    data = response.json()

    if not isinstance(data, list):
        return []

    cleaned_repos = []

    for repo in data:

        cleaned_repos.append({

            "repo_name": repo.get("name"),

            "repo_url": repo.get("html_url"),

            "description": repo.get("description"),

            "stars": repo.get("stargazers_count"),

            "forks": repo.get("forks_count")

        })

    return cleaned_repos