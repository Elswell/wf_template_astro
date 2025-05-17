import { type JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

type LazyImageProps = JSX.IntrinsicElements["img"] & {
  src: string;
  lazy?: boolean;
};

const LazyImage = ({
  src,
  alt = "",
  lazy = true,
  ...props
}: LazyImageProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (lazy) {
      import("@/helpers/lazyload").then(({ getLazyLoadInstance }) => {
        getLazyLoadInstance();
      });
    }
    setMounted(true);
  }, [lazy]);

  return (
    <>
      <img {...(lazy ? { "data-src": src } : { src })} alt={alt} {...props} />
      {lazy && mounted && (
        <noscript>
          <img src={src} alt={alt} {...props} />
        </noscript>
      )}
    </>
  );
};

export default LazyImage;
