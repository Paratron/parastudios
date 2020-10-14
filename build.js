const fs = require('fs-extra');
const utils = require('util');
const marked = require('marked');
const hljs = require("highlight.js");

const host = 'https://parastudios.de';
const buildTargetDirectory = './docs';

/**
 * I want to highlight my code blocks written in markdown by using highlight.js
 * This way, the code will be statically highlighted without JS in the browser ✌
 */
marked.setOptions({
    highlight: function (code, lang) {
        const result = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code);
        return result.value;
    }
});

const escapeText = (text) => text.toLowerCase().replace(/[^\w]+/g, '-');

/**
 * Override the default render function for headlines so they are hash links.
 */
const renderer = {
    heading(text, level) {
        return `
            <h${level} id="${escapeText(text)}">
              <a class="anchor" href="#${escapeText(text)}">
                ${text}
              </a>
            </h${level}>`;
    }
};

marked.use({renderer});

const views = require("./views");

const readDir = utils.promisify(fs.readdir);
const readFile = utils.promisify(fs.readFile);
const writeFile = utils.promisify(fs.writeFile);

const fullData = {
    pages: [],
    posts: [], // Published posts
    fullPosts: [], // Published and draft posts
    site: require('./package').site
};

const fileExists = (filename, files) => !!(files.find(f => f === filename));

/**
 * I want to show a little navigation in the post sidebar that links to the posts inner headlines.
 * In order to build that nav, I am running through the lexed nodes of the markdown post to find all headlines.
 */
const buildPostOutlineFromLexedMarkdown = (lex) => {
    let outline = [];
    lex.forEach(elm => {
        if (elm.type === "heading" && elm.depth > 1) {
            outline.push({level: elm.depth, text: elm.text, hash: escapeText(elm.text)});
        }
    });

    return outline;
};

/**
 * For sharing, its better to have a custom image extracted from the post.
 */
const getShareImageFromPost = (lex, slug) => {
    const url = require("url");

    for(let i = 0; i < lex.length; i++){
        const elm = lex[i];
        if(elm.type === "paragraph"){
            if(elm.tokens && elm.tokens.length){
                const t = elm.tokens[0];

                if(t.type === "image"){
                    return url.resolve(`${slug}/`, t.href);
                }
            }
        }
    }

    return undefined;
}

fs.ensureDir(`${buildTargetDirectory}/assets`);
readDir('./assets')
    .then(assets => assets.forEach(
        asset => fs.copyFile(`./assets/${asset}`, `${buildTargetDirectory}/assets/${asset}`)
    ));

readDir('./posts').then(async (folders) => {
    console.log('Pre-Pass: Gathering post meta');

    const posts = await folders.map(async (folder) => {
        const files = await readDir(`./posts/${folder}`) || [];
        const post = Object.assign(
            {
                title: folder,
                slug: folder,
                files,
                folder,
                publishTime: (new Date()).toString(),
                shareImage: undefined,
                content: ''
            },
            require(`./posts/${folder}/meta`)
        );

        const hasMarkdownIndex = fileExists('index.md', files);

        if (hasMarkdownIndex) {
            const markdownSource = await readFile(`./posts/${folder}/index.md`, 'utf8');
            post.content = marked(markdownSource);

            const lexedSource = marked.lexer(markdownSource);
            post.outline = buildPostOutlineFromLexedMarkdown(lexedSource);
            post.shareImage = getShareImageFromPost(lexedSource, `${host}/${post.slug}`);
        }

        return post;
    });

    console.log(posts.length, ' Posts prepared');

    Promise.all(posts).then(async (posts) => {
        posts.sort((a, b) =>
            a.publishTime > b.publishTime
                ? -1
                : 1
        );

        fullData.fullPosts = posts;
        fullData.posts = posts.filter((post) => !post.draft);

        async function renderPost(post) {
            const html = await views.post(fullData, post);
            fs.ensureDir(`${buildTargetDirectory}/${post.slug}`);
            writeFile(`${buildTargetDirectory}/${post.slug}/index.html`, html);
            post.files.forEach(f => fs.copyFile(`./posts/${post.folder}/${f}`, `${buildTargetDirectory}/${post.slug}/${f}`));
        }

        posts.forEach(renderPost);

        /**
         * We write RSS and index files at the END, because they need the list of existing posts.
         */
        writeFile(`${buildTargetDirectory}/posts.rss`, views.rss(fullData));
        writeFile(`${buildTargetDirectory}/index.html`, await views.blogIndex(fullData, fullData.posts));
        writeFile(`${buildTargetDirectory}/_drafts.html`, await views.postList(fullData, fullData.fullPosts.filter(p => p.draft)));
    });
});
