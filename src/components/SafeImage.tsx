import * as React from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=800&q=75&fm=webp";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Pass true for above-the-fold hero images to disable lazy loading */
  eager?: boolean;
};

export function SafeImage({ src, onError, eager, loading, fetchPriority, decoding, ...props }: Props) {
  const [url, setUrl] = React.useState(src || FALLBACK);

  React.useEffect(() => {
    setUrl(src || FALLBACK);
  }, [src]);

  return (
    <img
      {...props}
      src={url}
      referrerPolicy="no-referrer"
      // Lazy load everything by default. Caller can override with eager=true or loading="eager"
      loading={eager ? "eager" : (loading ?? "lazy")}
      // Native async decoding avoids blocking the main thread
      decoding={decoding ?? (eager ? "sync" : "async")}
      // Hint browser to fetch hero images at high priority
      fetchPriority={eager ? "high" : (fetchPriority ?? "low")}
      onError={(e) => {
        if (url !== FALLBACK) setUrl(FALLBACK);
        onError?.(e);
      }}
    />
  );
}
