import GithubOauth2 from 'torii/providers/github-oauth2';

export default class GitHubToriiProvider extends GithubOauth2 {
  fetch(data) {
    return data;
  }
}
