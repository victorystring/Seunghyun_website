import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer } from 'marked';
import katex from 'katex';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, '_site');
const baseUrl = 'https://victorystring.github.io/Seunghyun_website/';
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const readableTitle = value => escape(value).replaceAll('Magnetohydrodynamics', 'Magneto&shy;hydro&shy;dynamics');
const plain = value => value.replace(/<[^>]*>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
const template = await fs.readFile(path.join(root, '_templates/blog-shell.html'), 'utf8');
const posts = JSON.parse(await fs.readFile(path.join(root, 'posts/posts.json'), 'utf8'));
const seenSlugs = new Set();

// Only the disposable build directory may be cleared, on Windows and on CI.
if (path.dirname(output) !== root || path.basename(output) !== '_site') throw new Error('Unsafe build output path');
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
for (const directory of ['css', 'fonts', 'images', 'js', 'videos']) await fs.cp(path.join(root, directory), path.join(output, directory), { recursive: true });
for (const file of ['index.html', 'about.html', 'publications.html', 'projects.html', 'gallery.html']) await fs.copyFile(path.join(root, file), path.join(output, file));
await fs.mkdir(path.join(output, 'vendor/katex'), { recursive: true });
await fs.copyFile(path.join(root, 'node_modules/katex/dist/katex.min.css'), path.join(output, 'vendor/katex/katex.min.css'));
await fs.copyFile(path.join(root, 'node_modules/katex/LICENSE'), path.join(output, 'vendor/katex/LICENSE'));
await fs.cp(path.join(root, 'node_modules/katex/dist/fonts'), path.join(output, 'vendor/katex/fonts'), { recursive: true });

for (const post of posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || seenSlugs.has(post.slug)) throw new Error(`Invalid or duplicate slug: ${post.slug}`);
  seenSlugs.add(post.slug);
  for (const key of ['title', 'category', 'description', 'cover', 'coverAlt']) if (!post[key]) throw new Error(`Missing ${key}: ${post.slug}`);
  await fs.access(path.join(root, post.cover));
  post.sourceDirectory = path.join(root, 'posts', post.slug);
  post.markdown = (await fs.readFile(path.join(post.sourceDirectory, 'index.md'), 'utf8')).replace(/^\uFEFF/, '').replaceAll('\r\n', '\n');
  if (!post.markdown.startsWith(`# ${post.title}\n`)) throw new Error(`Markdown title does not match metadata: ${post.slug}`);
  const prose = post.markdown.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  post.readingTime = Math.max(1, Math.ceil(plain(prose).split(/\s+/).length / 220));
}

const shell = data => template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (!(key in data)) throw new Error(`Missing template value: ${key}`);
  return data[key];
}).replace(/[ \t]+$/gm, '');
const common = { OG_TYPE: 'website', MATH_CSS: '', STRUCTURED_DATA: '', IMAGE_DIALOG: '', BLOG_CURRENT: ' aria-current="page"' };
const cards = posts.map(post => `<a class="post-card" href="blog/${post.slug}/" aria-label="Read ${escape(post.title)}">
  <img class="post-card-cover" src="${escape(post.cover)}" alt="${escape(post.coverAlt)}" loading="lazy" width="800" height="450">
  <div class="post-card-copy"><span class="journal-kicker">${escape(post.category)}</span><h2>${readableTitle(post.title)}</h2><p>${escape(post.description)}</p>
  <div class="post-card-meta"><span>Seunghyun Sim · ${post.readingTime} min read</span><span class="read-link">Read article <span aria-hidden="true">↗</span></span></div></div></a>`).join('\n');
const indexContent = `<div class="journal-container"><header class="journal-intro"><span class="journal-kicker">Research notes</span><h1>My Blog</h1><p>Ideas, methods, and lessons from exploring physical systems through mathematical modeling.</p></header><div class="post-grid">${cards}</div></div>`;
const index = shell({ ...common, ROOT: '', TITLE: 'My Blog | Seunghyun Sim', DESCRIPTION: 'Research notes on multiphysics modeling, fluidized beds, plasma arcs, and scientific machine learning.', CANONICAL: baseUrl + 'blog.html', OG_IMAGE: baseUrl + 'images/seunghyun-sim-social-preview.png', IMAGE_ALT: 'Seunghyun Sim research portfolio', PAGE_CLASS: 'journal-index', CONTENT: indexContent });
await fs.writeFile(path.join(output, 'blog.html'), index);
// Keep the repository's existing blog entry point useful; its content is generated from posts.json.
await fs.writeFile(path.join(root, 'blog.html'), index);

let equationCount = 0;
for (const post of posts) {
  const headings = [];
  const ids = new Map();
  const imageSizes = new Map();
  for (const match of post.markdown.matchAll(/!\[[^\]]*\]\((assets\/[^)]+)\)/g)) {
    const bytes = await fs.readFile(path.join(post.sourceDirectory, match[1]));
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) imageSizes.set(match[1], { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });
  }
  const renderer = new Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const content = this.parser.parseInline(tokens);
    const label = plain(content);
    const base = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    const count = ids.get(base) || 0;
    ids.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    if (depth === 2) headings.push({ id, label });
    return `<h${depth} id="${id}">${content}</h${depth}>\n`;
  };
  renderer.html = ({ text }) => escape(text); // Articles use Markdown rather than executable raw HTML.
  renderer.link = function ({ href, title, tokens }) {
    if (!/^(https?:\/\/|mailto:|#)/i.test(href)) throw new Error(`Unsupported article link: ${href}`);
    return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${this.parser.parseInline(tokens)}</a>`;
  };
  renderer.image = ({ href, text, title }) => {
    if (!/^assets\/[a-zA-Z0-9._-]+\.(png|svg|jpe?g|webp)$/i.test(href)) throw new Error(`Unsupported figure path: ${href}`);
    const size = imageSizes.get(href);
    return `<a class="figure-zoom" href="${escape(href)}" target="_blank" rel="noopener" aria-label="Expand figure: ${escape(text)}"><img src="${escape(href)}" alt="${escape(text)}"${size ? ` width="${size.width}" height="${size.height}"` : ''}${title ? ` title="${escape(title)}"` : ''} loading="lazy" decoding="async"></a>`;
  };
  const parser = new Marked({ renderer, gfm: true });
  parser.use({ extensions: [{ name: 'displayMath', level: 'block', start: src => src.indexOf('$$'), tokenizer(src) {
    const match = /^\$\$\s*\n([\s\S]+?)\n\$\$(?:\n|$)/.exec(src);
    if (match) return { type: 'displayMath', raw: match[0], expression: match[1] };
  }, renderer(token) { equationCount++; return `<div class="equation" role="region" aria-label="Mathematical equation" tabindex="0">${katex.renderToString(token.expression, { displayMode: true, throwOnError: true, trust: false, output: 'htmlAndMathml' })}</div>\n`; } }, {
    name: 'inlineMath', level: 'inline', start: src => src.indexOf('$'), tokenizer(src) {
      const match = /^\$([^$\n]+?)\$(?!\$)/.exec(src);
      if (match) return { type: 'inlineMath', raw: match[0], expression: match[1] };
    }, renderer(token) { return katex.renderToString(token.expression, { throwOnError: true, trust: false, output: 'htmlAndMathml' }); }
  }] });
  let markdown = post.markdown.replace(/^# [^\n]+\n+/, '');
  // The deck is already displayed in the article header.
  if (markdown.startsWith(`*${post.description}*\n`)) markdown = markdown.slice(markdown.indexOf('\n') + 1).trimStart();
  let body = parser.parse(markdown);
  body = body.replace(/<p>(<a class="figure-zoom"[\s\S]*?<\/a>)<\/p>\s*(?:<p><em>(Figure [\s\S]*?)<\/em><\/p>)?/g, (_, img, caption) => `<figure>${img}<span class="figure-hint" aria-hidden="true">Click to enlarge</span>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`);
  body = body.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-scroll" role="region" aria-label="Data table; scroll horizontally on small screens" tabindex="0"><table>$1</table></div>');
  const articleDirectory = path.join(output, 'blog', post.slug);
  await fs.mkdir(articleDirectory, { recursive: true });
  await fs.cp(path.join(post.sourceDirectory, 'assets'), path.join(articleDirectory, 'assets'), { recursive: true });
  const figurePaths = [...post.markdown.matchAll(/!\[[^\]]*\]\((assets\/[^)]+)\)/g)].map(match => match[1]);
  for (const figure of figurePaths) await fs.access(path.join(articleDirectory, figure));
  const related = posts.filter(other => other.slug !== post.slug).map(other => `<a class="related-note" href="../${other.slug}/"><span class="journal-kicker">${escape(other.category)}</span><h3>${readableTitle(other.title)}</h3><span class="reading-time">${other.readingTime} min read <span aria-hidden="true">↗</span></span></a>`).join('');
  const content = `<div class="journal-container"><header class="article-hero" id="article-top"><a class="back-link" href="../../blog.html"><span aria-hidden="true">←</span> My Blog</a><div class="journal-kicker">${escape(post.category)}</div><h1>${readableTitle(post.title)}</h1><p class="article-deck">${escape(post.description)}</p><div class="article-byline"><strong>By Seunghyun Sim</strong><span class="separator" aria-hidden="true"></span><span>${post.readingTime} min read</span></div></header>
  <div class="article-layout"><article class="article-body" aria-label="${escape(post.title)}">${body}</article><aside class="article-toc" aria-label="Article navigation"><details open><summary>On this page</summary><ol class="toc-links">${headings.map(h => `<li><a href="#${h.id}">${escape(h.label)}</a></li>`).join('')}</ol></details><a class="toc-top" href="#article-top">Back to top ↑</a></aside></div>
  <section class="more-notes" aria-labelledby="more-notes-title"><h2 id="more-notes-title">Continue reading</h2><div class="related-grid">${related}</div></section></div>`;
  const canonical = `${baseUrl}blog/${post.slug}/`;
  const structured = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, author: { '@type': 'Person', name: 'Seunghyun Sim', url: baseUrl + 'about.html' }, mainEntityOfPage: canonical, url: canonical, image: baseUrl + post.cover, inLanguage: 'en', articleSection: post.category };
  const html = shell({ ...common, ROOT: '../../', TITLE: escape(`${post.title} | Seunghyun Sim`), DESCRIPTION: escape(post.description), CANONICAL: canonical, OG_TYPE: 'article', OG_IMAGE: baseUrl + post.cover, IMAGE_ALT: escape(post.coverAlt), PAGE_CLASS: 'journal-article', BLOG_CURRENT: '', MATH_CSS: '<link rel="stylesheet" href="../../vendor/katex/katex.min.css">', STRUCTURED_DATA: `<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script>`, IMAGE_DIALOG: '<dialog class="figure-dialog" aria-label="Expanded figure"><button class="dialog-close" type="button" autofocus>Close ×</button><img alt=""><div class="dialog-caption"></div></dialog>', CONTENT: content });
  await fs.writeFile(path.join(articleDirectory, 'index.html'), html);
  console.log(`Built ${post.slug}: ${headings.length} sections, ${figurePaths.length} figures, ${post.readingTime} min read`);
}
await fs.writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built ${posts.length} articles and ${equationCount} equations into _site/`);
