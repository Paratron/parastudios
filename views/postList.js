const fetch = require("node-fetch");
const frame = require("./frame");

function renderPost(post) {
    return `<section class="postListing">
    <a href="./${post.slug}/" class="imgConstraint">
    <img class="postImg" src="${post.shareImage}" alt="${post.title}" />
    </a>
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

const blogIndex = async (data, posts) => {
    const {renderGithubProfile} = require("./github");

    const aside = `<aside>
        ${await renderGithubProfile()}
</aside>`;

    return postList(data, posts, aside);
};

module.exports = {
    postList,
    blogIndex
};
