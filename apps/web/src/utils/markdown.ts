/**
 * Tiny markdown-to-HTML converter for service documentation.
 *
 * SECURITY TODO: this does NOT sanitize the output. Raw HTML in the source is
 * passed straight through, so a service's docsMarkdown can inject arbitrary HTML
 * when rendered with dangerouslySetInnerHTML. This needs sanitization (e.g.
 * escaping raw HTML or running the output through DOMPurify). See docs/SECURITY.md.
 */
export function renderMarkdownUnsafe(markdown: string): string {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let inList = false;

  const inline = (text: string): string =>
    text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  for (const line of lines) {
    if (line.startsWith('### ')) {
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith('> ')) {
      html.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
    } else if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    } else if (line.trim() === '') {
      // blank line
    } else {
      // Raw lines (including any raw HTML) are emitted verbatim.
      html.push(`<p>${inline(line)}</p>`);
    }

    if (inList && !line.startsWith('- ')) {
      html.push('</ul>');
      inList = false;
    }
  }
  if (inList) html.push('</ul>');

  return html.join('\n');
}
