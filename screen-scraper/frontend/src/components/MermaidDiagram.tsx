import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface Props {
  chart: string;
  id?: string;
}

export function MermaidDiagram({ chart, id = "mermaid" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
        const uniqueId = `${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) return <div className="error-banner">{error}</div>;
  return <div ref={containerRef} className="mermaid-container" />;
}
