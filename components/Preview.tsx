import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  className?: string;
};

const Preview = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "p-3 border rounded-lg overflow-hidden flex justify-center",
        className
      )}
    >
      <div className="relative h-full aspect-[16/9] rounded-lg border shadow-md overflow-hidden">
        <Image
          className="object-cover"
          src="/marceneiro.jpg"
          alt="Video Preview"
          fill
        />
      </div>
    </div>
  );
};

export default Preview;
