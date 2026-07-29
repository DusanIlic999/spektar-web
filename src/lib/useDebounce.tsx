import { useEffect, useState } from "react";

export const useDebounce = (text: string, delay: number) => {
  const [debounce, setDebounce] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(text);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return debounce;
};
