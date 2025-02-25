import { ControlValues } from "@/lib/type";
import { cn } from "@/lib/utils";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = {
  values: ControlValues;
  width: number;
} & HTMLAttributes<HTMLDivElement>;

const ThumbImage = ({ values, width, className, ...props }: Props) => {
  const [artworkUrl, setArtworkUrl] = useState<string>();

  useEffect(() => {
    setArtworkUrl(URL.createObjectURL(values.artwork));

    return () => {
      if (artworkUrl) URL.revokeObjectURL(artworkUrl);
    };
  }, [values]);

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden bg-black",
        className,
      )}
      style={{ width, fontSize: (width || 1) / 30 }}
      {...props}
    >
      <div className="bg-opacity-50 absolute top-0 left-0 z-10 size-full bg-black/58" />
      <img
        src={artworkUrl}
        style={{ width: width * 1.05 + "px", filter: `blur(${width / 100}px)` }}
        className="absolute top-1/2 left-1/2 z-0 aspect-video max-w-[unset] -translate-x-1/2 -translate-y-1/2 transform-fill"
      />
      <img
        src={artworkUrl}
        className="absolute top-1/2 left-1/2 z-20 aspect-square w-16/50 -translate-x-1/2 -translate-y-1/2 transform rounded-[5%] border-[0.01em] border-gray-600 shadow-md"
      />
    </div>
  );
};

export default ThumbImage;
