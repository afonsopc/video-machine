import { ControlValues, ProcessedValues } from "@/lib/type";
import { cn, getYoutubeTags } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { createVideo, processValues } from "@/lib/video-processing";
import { Button } from "./ui/button";
import { zipBlobs } from "@/lib/archive";

type Props = {
  values: ControlValues;
};

const Output = ({ values }: Props) => {
  if (!values) throw new Error("Values are required");

  const [processedValues, setProcessedValues] = useState<ProcessedValues>();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [video, setVideo] = useState<Blob>();
  const [zip, setZip] = useState<Blob>();
  const [zipUrl, setZipUrl] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const process = async () => {
      try {
        const processedValues = await processValues(values, setProgress);
        setProcessedValues(processedValues);
        const videoBlob = await createVideo(processedValues, setProgress);
        setVideo(videoBlob);
        setVideoUrl(URL.createObjectURL(videoBlob));
        const zipBlob = await zipBlobs([
          { fileName: "video.mp4", blob: videoBlob },
          { fileName: "thumb.png", blob: processedValues.thumbImage },
          { fileName: "video.png", blob: processedValues.videoImage },
          { fileName: "modified-song.wav", blob: processedValues.modifiedSong },
          { fileName: "artwork", blob: values.artwork },
          { fileName: "song", blob: values.song },
        ]);
        setZip(zipBlob);
        setZipUrl(URL.createObjectURL(zipBlob));
      } catch (error) {
        toast.error("Error processing values");
        console.error(error);
        return;
      }
    };

    process();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (zipUrl) URL.revokeObjectURL(zipUrl);
    };
  }, [values]);

  const handleZipDownload = () => {
    if (!zipUrl) return;

    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = `slowed ${values.title}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    a.remove();
  };

  if (!videoUrl)
    return (
      <Progress value={progress} className={cn(progress === 100 && "hidden")} />
    );

  return (
    <div className="flex max-w-[640px] flex-col gap-3">
      <h1 className="font-bold">Here is your video!</h1>
      <video src={videoUrl} controls className="rounded-lg border shadow-md" />
      <h1 className="font-bold">
        {values.artists[0]} - {values.title} (Slowed + Reverb)
      </h1>
      <hr />
      <p>
        {values.title} from {values.artists.slice(0, -1).join(", ")}{" "}
        {values.artists.length > 1 && "and"}{" "}
        {values.artists[values.artists.length - 1]} (Slowed and Reverbed)
      </p>
      <a
        href={values.url}
        target="_blank"
        className="text-blue-500 dark:text-blue-400"
      >
        {values.url}
      </a>
      <hr />
      <h1 className="font-bold">Tags</h1>
      <p>{getYoutubeTags(values.title, values.artists)}</p>
      <hr />
      <Button onClick={handleZipDownload} disabled={!zip}>
        {zip ? "Download ZIP" : "Zipping..."}
      </Button>
    </div>
  );
};

export default Output;
