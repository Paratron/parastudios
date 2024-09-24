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
    <div>
        <h1>${user.name}</h1>
        <h2>@${user.login.toLowerCase()}</h2>
        <p>${user.bio}</p>
    </div>

    <nav>
        <a href="https://twitter.com/paratron">Follow me on Twitter</a>
        <a href="${user.html_url}">Follow me on Github</a>
        <a href="https://www.linkedin.com/in/christian-engel-a73457236/">Connect on LinkedIn</a>
    </nav>
    
</section>`;
}

module.exports = {
    getGithubData,
    renderGithubProfile,
}
