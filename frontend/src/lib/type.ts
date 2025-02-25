export type ControlValues = {
  artwork: File;
  song: File;
  artists: string[];
  title: string;
  url?: string;
};

export type ProcessedValues = {
  videoImage: Blob;
  thumbImage: Blob;
  modifiedSong: Blob;
};
