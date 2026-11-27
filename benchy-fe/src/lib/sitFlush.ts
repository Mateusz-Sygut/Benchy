type SitFlusher = () => Promise<void>;

let flusher: SitFlusher | null = null;

export function registerSitFlush(fn: SitFlusher): () => void {
  flusher = fn;
  return () => {
    if (flusher === fn) flusher = null;
  };
}

export async function flushActiveSit(): Promise<void> {
  await flusher?.();
}
