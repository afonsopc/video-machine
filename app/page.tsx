"use client";

import Assets from "@/components/Assets";
import EditorMenubar from "@/components/EditorMenubar";
import Preview from "@/components/Preview";
import Timeline from "@/components/Timeline";
import { Asset, AssetType, Track, TrackType } from "@/lib/types";
import { useState } from "react";

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>(
    [
      {
        name: "mal2.mp3",
        src: "/mal2.mp3",
        type: AssetType.AUDIO,
        previewSrc: "/audio.png",
      },
      {
        name: "marceneiro.jpg",
        src: "/marceneiro.jpg",
        type: AssetType.IMAGE,
        previewSrc: "/marceneiro.jpg",
      },
      {
        name: "keslley.jpg",
        src: "/keslley.jpg",
        type: AssetType.IMAGE,
        previewSrc: "/keslley.jpg",
      },
    ].flatMap((asset) => Array.from({ length: 7 }, () => asset))
  );

  const [tracks, setTracks] = useState<Track[]>([
    {
      type: TrackType.AUDIO,
      items: [
        {
          asset: assets[0],
          position: 0,
          start: 0,
          end: 10,
        },
      ],
    },
    {
      type: TrackType.VIDEO,
      items: [
        {
          asset: assets[7],
          position: 4,
          start: 0,
          end: 10,
        },
      ],
    },
    {
      type: TrackType.VIDEO,
      items: [
        {
          asset: assets[14],
          position: 2,
          start: 0,
          end: 5,
        },
      ],
    },
  ]);

  return (
    <div className="flex flex-col p-10 gap-3">
      <EditorMenubar />
      <div className="flex gap-3 h-96">
        <div className="w-[40%] h-full flex-shrink-0">
          <Preview className="w-full h-full" />
        </div>
        <Assets className="flex-1" assets={assets} setAssets={setAssets} />
      </div>
      <Timeline assets={assets} tracks={tracks} setTracks={setTracks} />
    </div>
  );
}
