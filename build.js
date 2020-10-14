const fs = require('fs-extra');
const utils = require('util');
const marked = require('marked');
const hljs = require("highlight.js");

const buildTargetDirectory = './docs';

marked.setOptions({
    highlight: function(code, lang) {
        const result = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code);
        return result.value;
    }
});

const escapeText = (text) => text.toLowerCase().replace(/[^\w]+/g, '-');

// Override function
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

marked.use({ renderer });

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

const buildOutlineFromLexedMarkdown = (lex) => {
    let outline = [];
    lex.forEach(elm => {
        if(elm.type === "heading" && elm.depth > 1){
            outline.push({level: elm.depth, text: elm.text, hash: escapeText(elm.text)})
        }
    });

    return outline;
};

fs.ensureDir(`${buildTargetDirectory}/assets`);
readDir('./assets').then(assets => assets.forEach(asset => fs.copyFile(`./assets/${asset}`, `${buildTargetDirectory}/assets/${asset}`)));

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
                content: ''
            },
            require(`./posts/${folder}/meta`)
        );

        const hasMarkdownIndex = fileExists('index.md', files);

        if (hasMarkdownIndex) {
            const markdownSource = await readFile(`./posts/${folder}/index.md`, 'utf8');
            post.content = marked(markdownSource);
            post.outline = buildOutlineFromLexedMarkdown(marked.lexer(markdownSource));
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

        async function renderPost(post){
            const html = await views.post(fullData, post);
            fs.ensureDir(`${buildTargetDirectory}/${post.slug}`);
            writeFile(`${buildTargetDirectory}/${post.slug}/index.html`, html);
            post.files.forEach(f => fs.copyFile(`./posts/${post.folder}/${f}`, `${buildTargetDirectory}/${post.slug}/${f}`));
        }

        posts.forEach(renderPost);

        writeFile(`${buildTargetDirectory}/posts.rss`, views.rss(fullData));
        writeFile(`${buildTargetDirectory}/index.html`, await views.blogIndex(fullData, fullData.posts));
        writeFile(`${buildTargetDirectory}/_drafts.html`, await views.postList(fullData, fullData.fullPosts.filter(p => p.draft)));
    });
});
