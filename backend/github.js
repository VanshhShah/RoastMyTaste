const axios = require("axios");

async function getGithubData(username){
    try {
        const userRes = await axios.get(`https://api.github.com/users/${username}`);
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);

        const user = userRes.data;
        const repos = reposRes.data;

        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        return {
            username: user.login,
            followers: user.followers,
            following: user.following,
            public_repos: user.public_repos,
            total_stars: totalStars,
            bio: user.bio || "no bio"
        };
    } catch (err) {
        throw new Error("Invalid Github username");
    }
}

module.exports = getGithubData;