module.exports = ({site, posts}) => `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>${site.title}</title>
    <link>${site.url}</link>
    <description>${site.description}</description>
    <language>en-en</language>
    <copyright>Christian Engel</copyright>
    <pubDate>${(new Date()).toUTCString()}</pubDate>
    <image>
      <url>${site.url}/assets/web-love.svg</url>
      <title>${site.title} - Logo</title>
      <link>${site.url}</link>
    </image>

    ${posts.map((post => `<item>
      <title>${post.title}</title>
      <description>${post.description}</description>
      <link>${site.url}/${post.slug}</link>
      <author>Christian Engel</author>
      <guid>${post.slug}</guid>
      <pubDate>${(new Date(post.publishTime)).toUTCString()}</pubDate>
    </item>`)).join("\n    ")}
  </channel>
</rss>`;
