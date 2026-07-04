function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  const listStack: Array<{ type: "ul" | "ol"; hasOpenItem: boolean }> = [];

  function closeLists(targetDepth = 0): void {
    while (listStack.length > targetDepth) {
      const list = listStack.pop();
      if (list?.hasOpenItem) html.push("</li>");
      if (list) html.push(`</${list.type}>`);
    }
  }

  function ensureList(type: "ul" | "ol", depth: number): void {
    while (listStack.length > depth) closeLists(depth);

    const current = listStack[depth];
    if (!current || current.type !== type) {
      closeLists(depth);
      html.push(`<${type}>`);
      listStack.push({ type, hasOpenItem: false });
    }
  }

  function addListItem(
    type: "ul" | "ol",
    depth: number,
    content: string,
  ): void {
    ensureList(type, depth);

    const current = listStack[depth];
    if (!current) return;
    if (current.hasOpenItem) html.push("</li>");
    html.push(`<li>${inlineMarkdown(content)}`);
    current.hasOpenItem = true;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeLists();
      return;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const unorderedItem = /^(\s*)[-*]\s+(.+)$/.exec(line);
    if (unorderedItem) {
      const depth = Math.floor(
        unorderedItem[1].replace(/\t/g, "  ").length / 2,
      );
      addListItem("ul", depth, unorderedItem[2].trim());
      return;
    }

    const orderedItem = /^(\s*)\d+\.\s+(.+)$/.exec(line);
    if (orderedItem) {
      const depth = Math.floor(orderedItem[1].replace(/\t/g, "  ").length / 2);
      addListItem("ol", depth, orderedItem[2].trim());
      return;
    }

    closeLists();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  });

  closeLists();
  return html.join("");
}
