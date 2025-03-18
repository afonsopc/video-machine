export type Crop = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const cropImage = async (
  image: HTMLImageElement,
  crop: Crop,
  compression?: number,
  type?: string,
): Promise<Blob> => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const scaledWidth = crop.width * scaleX;
  const scaledHeight = crop.height * scaleY;

  const canvas = document.createElement("canvas");
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to get canvas 2d context");
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    scaledWidth,
    scaledHeight,
    0,
    0,
    scaledWidth,
    scaledHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Error exporting to blob"));
        } else {
          resolve(blob);
        }
      },
      type ?? "image/webp",
      compression,
    );
  });
};
