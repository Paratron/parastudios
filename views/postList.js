const fetch = require("node-fetch");
const frame = require("./frame");

function renderPost(post) {
    return `<section class="postListing">
    <h3><a href="./${post.slug}/">${post.title}</a></h3>
    <small>Published on ${new Date(post.publishTime).toDateString()}</small>
    ${post.description ? `<p>${post.description}</p>` : ""}
    <p>
        <a href="./${post.slug}/">Read ${post.title}</a>
    </p>
</section>`;
}

const postList = (data, posts, aside = "") => {
    const body = `<main>
${posts.map(renderPost).join("\n")}
</main>${aside}`;

    return frame(data.site, "Recent Posts", "This is a list of my recent posts.", body);
};

async function githubData() {
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

const blogIndex = async (data, posts) => {
    const user = await githubData();

    const aside = `<aside>
<section class="profile">
    <a href="${user.html_url}">
        <img alt="Christian's Github Avatar" src="${user.avatar_url}" />
    </a>
    <h1>${user.name}</h1>
    <h2>${user.login}</h2>
    <p>${user.bio}</p>
    
</section>
</aside>`;

    return postList(data, posts, aside);
};

module.exports = {
    postList,
    blogIndex
};
