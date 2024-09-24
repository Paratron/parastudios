const frame = require("./frame");
const { renderGithubProfile } = require("./github");

const buildOutline = (outline) => {
    if (!outline) {
        return "";
    }

    return `<nav class="outline">
        <h3>Post Content</h3>
        ${outline.map(elm => `<a href="#${elm.hash}" class="l${elm.level}">${elm.text}</a>`).join("\n")}
</nav>`;
};

const recentPosts = (posts) => {
    return `<nav class="posts">
    <h3>Recent posts</h3>
    <nav class="postList">
    ${posts.map(p => `<a href="../${p.slug}/"><span>${p.publishTime}</span> <span>${p.title}</span></a>`).join('\n')}
    </nav>
</nav>`;
};

const post = async (data, post) => {
    const body = `<article>
			${post.content}
		</article>
		<aside>
		    ${buildOutline(post.outline)}
            ${recentPosts(post.draft ? data.fullPosts : data.posts)}	
        </aside>
        <section class="bottom">
            ${await renderGithubProfile()}
        </section>`;

    return frame(data.site, post.title, post.description, body, post.shareImage);
};

module.exports = post;
