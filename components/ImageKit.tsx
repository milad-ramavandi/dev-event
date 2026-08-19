"use client";

import { URL_ENDPOINT } from "@/constants";
import { buildSrc, Image } from "@imagekit/next";
import { useState } from "react";

const ImageKit = ({
  src,
  width,
  height,
  alt,
  className,
  fill,
  unoptimized
}: {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  fill?: boolean;
  unoptimized?:boolean
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  return (
    <Image
      urlEndpoint={URL_ENDPOINT}
      src={src}
      {...(fill ? { fill } : { width, height })}
      alt={alt}
      className={className ? className : ""}
      {...(unoptimized && {unoptimized})}
      loading="eager"
      style={
        showPlaceholder
          ? {
              backgroundImage: `url(${buildSrc({
                urlEndpoint: `${URL_ENDPOINT}`,
                src: src,
                transformation: [
                  // {}, // Any other transformation you want to apply
                  {
                    quality: 10,
                    blur: 90,
                  },
                ],
              })})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
      onLoad={() => {
        setShowPlaceholder(false);
      }}
    />
  );
};

export default ImageKit;
