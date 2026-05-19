import * as React from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=800&q=85";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export function SafeImage({ src, onError, ...props }: Props) {
  const [url, setUrl] = React.useState(src || FALLBACK);

  React.useEffect(() => {
    setUrl(src || FALLBACK);
  }, [src]);

  return (
    <img
      {...props}
      src={url}
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (url !== FALLBACK) setUrl(FALLBACK);
        onError?.(e);
      }}
    />
  );
}
