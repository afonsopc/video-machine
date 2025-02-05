import { Asset, Track } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type Props = {
  className?: string;
  assets: Asset[];
  tracks: Track[];
  setTracks: Dispatch<SetStateAction<Track[]>>;
};

const Timeline = ({ className, assets, tracks, setTracks }: Props) => {
  return (
    <ScrollArea className={cn("p-3 border rounded-lg h-96", className)}>
      <Tracks tracks={tracks} assets={assets} setTracks={setTracks} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type TracksProps = {
  tracks: Track[];
  assets: Asset[];
  setTracks: Dispatch<SetStateAction<Track[]>>;
};

const Tracks = ({ tracks, assets, setTracks }: TracksProps) => {
  return (
    <div className="flex flex-col">
      {tracks.map((track, index) => (
        <TrackView
          key={index}
          track={track}
          assets={assets}
          pxPerSecond={50}
          setTracks={setTracks}
        />
      ))}
    </div>
  );
};

type TrackViewProps = {
  track: Track;
  assets: Asset[];
  pxPerSecond: number;
  setTracks: Dispatch<SetStateAction<Track[]>>;
};

const TrackView = ({
  track,
  assets,
  pxPerSecond,
  setTracks,
}: TrackViewProps) => {
  const maxEnd = track.items.reduce((acc, item) => Math.max(acc, item.end), 0);
  return (
    <div className="relative h-8 overflow-hidden">
      {track.items.map((item, index) => (
        <TrackItem
          key={index}
          item={item}
          assets={assets}
          pxPerSecond={pxPerSecond}
          setTracks={setTracks}
          track={track}
        />
      ))}
    </div>
  );
};

type TrackItemProps = {
  item: Track["items"][number];
  assets: Asset[];
  pxPerSecond: number;
  track: Track;
  setTracks: Dispatch<SetStateAction<Track[]>>;
};

const TrackItem = ({
  item,
  assets,
  pxPerSecond,
  track,
  setTracks,
}: TrackItemProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [mouseMovimentReason, setMouseMovimentReason] = useState<
    "drag" | "resizeLeft" | "resizeRight"
  >("drag");
  const [startPosition, setStartPosition] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const asset = assets.find((asset) => asset.src === item.asset.src);
  if (!asset) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setStartPosition(e.movementX);
    setCurrentPosition(e.movementX);
    if (e.currentTarget.id === "right-resize")
      setMouseMovimentReason("resizeRight");
    else if (e.currentTarget.id === "left-resize")
      setMouseMovimentReason("resizeLeft");
    else setMouseMovimentReason("drag");
  };

  const updateItem = (newItem: Track["items"][number]) => {
    const newItems = track.items.map((i) =>
      i === item ? { ...i, ...newItem } : i
    );
    setTracks((prev) =>
      prev.map((t) => (t === track ? { ...t, items: newItems } : t))
    );
  };

  useEffect(() => {
    if (!isResizing) return;
    const delta = currentPosition - startPosition;
    let newStart = item.start,
      newEnd = item.end,
      newPosition = item.position;
    if (mouseMovimentReason === "resizeLeft") {
      newStart = item.start + delta / pxPerSecond;
      newEnd = item.end;
      newPosition = item.position + delta / pxPerSecond;
    } else if (mouseMovimentReason === "resizeRight") {
      newStart = item.start;
      newEnd = item.end + delta / pxPerSecond;
    } else newPosition = item.position + delta / pxPerSecond;
    if (newStart < 0 || newEnd < 0 || newPosition < 0 || newEnd - newStart < 1)
      return;
    updateItem({
      ...item,
      start: newStart,
      end: newEnd,
      position: newPosition,
    });
  }, [currentPosition]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => setCurrentPosition(e.movementX);
    const handleMouseUp = (e: MouseEvent) => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);
  return (
    <div
      className="h-8 border relative rounded-md overflow-hidden select-none"
      style={{
        left: `${item.position * pxPerSecond}px`,
        width: `${(item.end - item.start) * pxPerSecond}px`,
      }}
    >
      <div
        id="left-resize"
        onMouseDown={handleMouseDown}
        className="absolute left-0 top-0 h-full w-2 bg-black z-10 cursor-col-resize"
      ></div>
      <div className="relative">
        <div
          id="drag"
          onMouseDown={handleMouseDown}
          className={cn(
            "absolute inset-0 bg-foreground cursor-grab",
            isResizing ? "opacity-40" : "opacity-20"
          )}
        />
        <img src={asset.previewSrc} alt={asset.name} className="w-full h-8" />
      </div>
      <div
        id="right-resize"
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-2 bg-black z-10 cursor-col-resize"
      ></div>
    </div>
  );
};

export default Timeline;
