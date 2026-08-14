// src/shared/hooks/useShare.ts
import { useCallback, useState } from 'react';

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

export function useShare() {
  const [copied, setCopied] = useState(false);

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copyLink = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);

  const share = useCallback(
    async (payload: SharePayload): Promise<ShareResult> => {
      if (canNativeShare) {
        try {
          await navigator.share(payload);
          return 'shared';
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
          // ostali error-i → padamo na clipboard
        }
      }
      return (await copyLink(payload.url)) ? 'copied' : 'failed';
    },
    [canNativeShare, copyLink],
  );

  return { share, copyLink, copied, canNativeShare };
}