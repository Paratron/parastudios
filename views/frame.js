const {getGithubData} = require("./github");

const twitterCardMeta = (site, title, description, image) =>
    `<meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="@paratron">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">`;

const frame = async (site, title, description, body, shareImage = "https://parastudios.de/assets/social.jpg") => {
    const user = await getGithubData();

    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <link href="../assets/favicon.svg" rel="shortcut icon">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>${title} - ${site.title}</title>
        ${description ? `<meta name="description" content="${description}" />` : ""}
        <link type="text/css" rel="stylesheet" href="../assets/style.css" />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/posts.rss" />
        ${twitterCardMeta(site, title, description, shareImage)}
    </head>
    <body>
		<header>
			<a class="blog-title" href="/" title="${site.title}"><img src="../assets/web-love-bright.svg" alt="web://❤" /></a>
            <small>${site.description}</small>
		</header>
		${body}
		<nav class="marginal">
            <a href="https://twitter.com/paratron">Follow me on Twitter</a>
            <a href="${user.html_url}">Follow me on Github</a>
            <a href="/posts.rss">Blog RSS</a>
        </nav>
        <button class="darkModeButton" onclick="toggleDarkMode()">Toggle Dark Mode</button>
        <script>
            function toggleDarkMode(){
                document.querySelector("html").toggleAttribute("data-dark");
                localStorage.setItem("dark", document.querySelector("html").getAttribute("data-dark"));
            }
            if(localStorage.getItem("dark") !== null){
                toggleDarkMode();
            }
        </script>
    </body>
</html>`;
};

module.exports = frame;
