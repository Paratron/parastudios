async function getGithubData() {
    let profile;

    try {
        profile = require("../assets/githubProfile.json");
        console.log("Loaded GH Data from disk");
    } catch (e) {
        profile = await fetch("https://api.github.com/users/paratron").then(res => res.json());
        require("fs").writeFile("../assets/githubProfile.json", JSON.stringify(profile), "utf8",() => {});
        console.log("Fetched GH Data from web");
    }
    return profile;
}

async function renderGithubProfile(){
    const user = await getGithubData();

    return `<section class="profile">
    <a href="${user.html_url}">
        <img alt="Christian's Github Avatar" src="${user.avatar_url}" />
    </a>
    <h1>${user.name}</h1>
    <h2>${user.login}</h2>
    <p>${user.bio}</p>
    
</section>`;
}

module.exports = {
    getGithubData,
    renderGithubProfile,
}
