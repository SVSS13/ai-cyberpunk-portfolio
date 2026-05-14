import requests

def get_github_repos(username):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    return response.json()