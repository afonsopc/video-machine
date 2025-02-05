"use client";

import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import DefaultPreview from "@/assets/marceneiro.jpg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Asset } from "@/lib/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  assets: Asset[];
  setAssets: Dispatch<SetStateAction<Asset[]>>;
};

const Assets = ({ className, assets, setAssets }: Props) => {
  return (
    <ScrollArea
      className={cn("p-3 border rounded-lg h-full w-full", className)}
    >
      <div className="flex justify-around flex-wrap gap-2 ">
        {assets.map((asset, index) => (
          <AssetPreview
            asset={asset}
            onRemove={() =>
              setAssets((prev) => prev.filter((_, i) => i !== index))
            }
            key={index}
            {...asset}
          />
        ))}
        {assets.length === 0 && (
          <div className="text-center select-none">Drop files here</div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type AssetPreviewProps = {
  asset: Asset;
  onRemove: () => void;
};

const AssetPreview = ({ asset, onRemove }: AssetPreviewProps) => {
  return (
    <div
      id="asset"
      className="relative w-44 rounded-md border aspect-video shadow-sm overflow-hidden select-none"
      draggable
    >
      <Button
        size="icon"
        variant="destructive"
        className="size-6 absolute top-1 right-1"
        onClick={onRemove}
      >
        <X />
      </Button>
      <div className="absolute w-full left-0 bottom-0 p-1 bg-black bg-opacity-50 text-white text-xs rounded-bl-md">
        {asset.name}
      </div>
      <Image
        draggable={false}
        src={asset.previewSrc ?? DefaultPreview}
        alt="Asset"
        className="aspect-video"
        width={200}
        height={200}
      />
    </div>
  );
};

export default Assets;
