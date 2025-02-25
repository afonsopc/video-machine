"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn, megabytesToBytes } from "@/lib/utils";
import { CloudUpload, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { ControlValues } from "@/lib/type";
import { getSong } from "@/lib/api";
import { useState } from "react";
import { Label } from "./ui/label";
import { toast } from "sonner";

const AUDIO_MIME_TYPES = [".mp3", ".wav", ".ogg", ".flac", ".webm"];
const IMAGE_MIME_TYPES = [
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".tiff",
];
const DEFAULT_DZ_CONFIG = {
  maxFiles: 1,
  maxSize: megabytesToBytes(1014),
  multiple: false,
};
const ARTWORK_DZ_CONFIG = {
  accept: { "image/*": IMAGE_MIME_TYPES },
  ...DEFAULT_DZ_CONFIG,
};
const SONG_DZ_CONFIG = {
  accept: { "audio/*": AUDIO_MIME_TYPES },
  ...DEFAULT_DZ_CONFIG,
};

const formSchema = z.object({
  title: z.string().min(1).max(255),
  artists: z
    .string()
    .min(1)
    .max(255 * 1000),
  artworkFiles: z.array(z.instanceof(File)).min(1, "Artwork is required"),
  songFiles: z.array(z.instanceof(File)).min(1, "Song is required"),
});

type Props = {
  className?: string;
  onSubmit: (values: ControlValues) => void;
};

export default function Control({ className, onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      title: values.title,
      artists: values.artists.split(", "),
      artwork: values.artworkFiles[0],
      song: values.songFiles[0],
      url,
    });
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
      const { audio, artwork, metadata } = await getSong(url);
      const artworkFile = new File(
        [await artwork.arrayBuffer()],
        "artwork.jpg",
        {
          type: "image/jpeg",
        },
      );
      const songFile = new File([await audio.arrayBuffer()], "song.opus", {
        type: "audio/opus",
      });
      form.setValue("title", metadata.title);
      form.setValue("artists", metadata.artist);
      form.setValue("artworkFiles", [artworkFile]);
      form.setValue("songFiles", [songFile]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch song");
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-3 rounded-lg border p-5 shadow-sm">
        <Label htmlFor="url">Song Fetcher</Label>
        <div className="flex justify-between gap-3">
          <Input
            id="url"
            placeholder="Song URL"
            type="text"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <Button
            onClick={handleFetch}
            variant="outline"
            disabled={!url || loading}
          >
            Fetch
          </Button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      <div className={cn(loading ? "hidden" : "block")}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="gecgecgec" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artists"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="100 gecs, Dylan Brady, Laura Les"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-evenly gap-3 sm:flex-row sm:gap-0">
              <FormField
                control={form.control}
                name="artworkFiles"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel>Artwork</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={(files) => field.onChange(files)}
                        dropzoneOptions={ARTWORK_DZ_CONFIG}
                        className="bg-background relative rounded-lg p-2"
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-1 outline-slate-500 outline-dashed"
                        >
                          <div className="flex w-full flex-col items-center justify-center p-8">
                            <CloudUpload className="h-10 w-10 text-gray-500" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {IMAGE_MIME_TYPES.slice(0, -1).join(", ")} or{" "}
                              {IMAGE_MIME_TYPES.slice(-1)}
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {field.value?.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span className="w-52 overflow-hidden overflow-ellipsis">
                                {file.name}
                              </span>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="songFiles"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel>Song</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={(files) => field.onChange(files)}
                        dropzoneOptions={SONG_DZ_CONFIG}
                        className="bg-background relative rounded-lg p-2"
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-1 outline-slate-500 outline-dashed"
                        >
                          <div className="flex w-full flex-col items-center justify-center p-8">
                            <CloudUpload className="h-10 w-10 text-gray-500" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {AUDIO_MIME_TYPES.slice(0, -1).join(", ")} or{" "}
                              {AUDIO_MIME_TYPES.slice(-1)}
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {field.value?.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span className="w-52 overflow-hidden overflow-ellipsis">
                                {file.name}
                              </span>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
