import { useMemo, useState } from "react";

export function useTruncate(text: string | null | undefined, limit = 100) {
  const [expanded, setExpanded] = useState(false);

  const full = text ?? "";
  const isTruncated = full.length > limit;

  const displayed = useMemo(() => {
    if (!isTruncated || expanded) return full;
    const cut = full.slice(0, limit);
    const lastSpace = cut.lastIndexOf(" ");
    // preseci na razmaku da ne prelomiš reč na pola
    return (
      (lastSpace > limit * 0.8 ? cut.slice(0, lastSpace) : cut).trimEnd() + "..."
    );
  }, [full, limit, isTruncated, expanded]);

  return {
    text: displayed,
    isTruncated,
    expanded,
    toggle: () => setExpanded((v) => !v),
  };
}
