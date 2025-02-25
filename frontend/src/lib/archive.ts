import JSZip from "jszip";

export const zipBlobs = async (
  blobs: { fileName: string; blob: Blob }[],
): Promise<Blob> => {
  const zip = new JSZip();
  blobs.forEach(({ fileName, blob }) => {
    zip.file(fileName, blob);
  });
  return zip.generateAsync({ type: "blob" });
};
