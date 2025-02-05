export enum AssetType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
}

export type Asset = {
  name: string;
  src: string;
  type: AssetType;
  previewSrc?: string;
};

export type TrackItem = {
  asset: Asset;
  position: number;
  start: number;
  end: number;
};

export enum TrackType {
  AUDIO = "audio",
  VIDEO = "video",
  CAPTION = "caption",
}

export type Track = {
  items: TrackItem[];
} & (
  | {
      type: TrackType.VIDEO;
    }
  | {
      type: TrackType.AUDIO;
    }
  | {
      type: TrackType.CAPTION;
    }
);
