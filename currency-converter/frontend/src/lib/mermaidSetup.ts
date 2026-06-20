import mermaid from "mermaid";
import { diagram as erDiagram } from "mermaid/dist/chunks/mermaid.core/erDiagram-TEJ5UH35.mjs";

let ready: Promise<typeof mermaid> | null = null;

/** Initialize Mermaid with ER diagram preloaded (avoids Vite dynamic-import failures). */
export function getMermaid(): Promise<typeof mermaid> {
  if (!ready) {
    ready = (async () => {
      mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
      await mermaid.registerExternalDiagrams(
        [
          {
            id: "er",
            detector: (text) => /^\s*erDiagram/.test(text),
            loader: async () => ({ id: "er", diagram: erDiagram }),
          },
        ],
        { lazyLoad: false }
      );
      return mermaid;
    })();
  }
  return ready;
}
