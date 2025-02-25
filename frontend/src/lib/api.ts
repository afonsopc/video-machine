const API_URL = "http://localhost:3000";

export const getArtwork = async (url: string): Promise<Blob> => {
  const response = await fetch(`${API_URL}/artwork/${encodeURIComponent(url)}`);
  return response.blob();
};

export const getAudio = async (url: string): Promise<Blob> => {
  const response = await fetch(`${API_URL}/audio/${encodeURIComponent(url)}`);
  return response.blob();
};

type Metadata = {
  title: string;
  artist: string;
};

export const getMetadata = async (url: string): Promise<Metadata> => {
  const response = await fetch(
    `${API_URL}/metadata/${encodeURIComponent(url)}`,
  );
  return response.json();
};

export const getSong = async (
  url: string,
): Promise<{ audio: Blob; artwork: Blob; metadata: Metadata }> => {
  const [audio, artwork, metadata] = await Promise.all([
    getAudio(url),
    getArtwork(url),
    getMetadata(url),
  ]);

  return { audio, artwork, metadata };
};
