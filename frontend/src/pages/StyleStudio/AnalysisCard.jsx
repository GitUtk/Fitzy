import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INLINE_RULES = [
  { pattern: /`([^`]+)`/g, render: (text, key) => <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">{text}</code> },
  { pattern: /\*\*([^*]+)\*\*/g, render: (text, key) => <strong key={key} className="font-semibold text-foreground">{text}</strong> },
  { pattern: /\*([^*]+)\*/g, render: (text, key) => <em key={key} className="italic">{text}</em> },
];

const renderInline = (text) => {
  if (!text) return text;

  const tokens = [{ type: "text", value: text }];

  INLINE_RULES.forEach(({ pattern, render }) => {
    for (let i = tokens.length - 1; i >= 0; i -= 1) {
      const token = tokens[i];
      if (token.type !== "text") continue;

      const parts = [];
      let lastIndex = 0;
      token.value.replace(pattern, (match, captured, offset) => {
        if (offset > lastIndex) {
          parts.push({ type: "text", value: token.value.slice(lastIndex, offset) });
        }
        parts.push({ type: "node", value: captured, render });
        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < token.value.length) {
        parts.push({ type: "text", value: token.value.slice(lastIndex) });
      }

      if (parts.length > 0) {
        tokens.splice(i, 1, ...parts);
      }
    }
  });

  return tokens.map((token, index) => {
    if (token.type === "node") {
      return token.render(token.value, `inline-${index}`);
    }
    return token.value;
  });
};

const renderMarkdown = (value) => {
  const lines = String(value || "").split("\n");
  const nodes = [];
  let currentList = [];
  let currentOrderedList = [];

  const flushLists = () => {
    if (currentList.length) {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="space-y-2 pl-5">
          {currentList.map((item, idx) => (
            <li key={`li-${idx}`} className="list-disc">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }

    if (currentOrderedList.length) {
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="space-y-2 pl-5">
          {currentOrderedList.map((item, idx) => (
            <li key={`oli-${idx}`} className="list-decimal">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      currentOrderedList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushLists();
      nodes.push(<div key={`sp-${index}`} className="h-3" />);
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);

    if (headingMatch) {
      flushLists();
      const level = headingMatch[1].length;
      const HeadingTag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      const classes =
        level === 1
          ? "text-xl font-semibold"
          : level === 2
            ? "text-lg font-semibold"
            : "text-base font-semibold";
      nodes.push(
        <HeadingTag key={`h-${index}`} className={classes}>
          {renderInline(headingMatch[2])}
        </HeadingTag>
      );
      return;
    }

    if (bulletMatch) {
      currentOrderedList = [];
      currentList.push(bulletMatch[1]);
      return;
    }

    if (orderedMatch) {
      currentList = [];
      currentOrderedList.push(orderedMatch[1]);
      return;
    }

    flushLists();
    nodes.push(
      <p key={`p-${index}`} className="leading-7">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushLists();

  return nodes;
};

function AnalysisCard({ analysis, loading, error }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">Style analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Readable AI feedback on the uploaded outfit.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!analysis && !loading && !error && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Upload an outfit to start the analysis.
          </div>
        )}

        {loading && !analysis && (
          <div className="space-y-3 rounded-xl border border-dashed border-border bg-muted/20 p-6">
            <div className="h-5 w-1/3 rounded bg-muted" />
            <div className="h-4 rounded bg-muted" />
            <div className="h-4 w-11/12 rounded bg-muted" />
            <div className="h-4 w-10/12 rounded bg-muted" />
            <div className="h-4 w-9/12 rounded bg-muted" />
          </div>
        )}

        {analysis && (
          <div className="space-y-3 rounded-xl border border-border bg-background p-5 text-sm text-foreground">
            {renderMarkdown(analysis)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AnalysisCard;
