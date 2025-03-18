export type ControlValues = {
  artwork: Blob;
  originalArtwork: File;
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
