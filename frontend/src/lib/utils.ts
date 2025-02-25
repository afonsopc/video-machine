import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const megabytesToBytes = (number: number) => {
  return number * 1024 * 1024;
};

export const getYoutubeTags = (title: string, artists: string[]) => {
  const artistTags = (artist: string) =>
    [
      artist,
      `${artist} slowed reverb`,
      artists.length < 8 ? `${artist} ${title} slowed` : undefined,
      artists.length < 8 ? `${artist} ${title} reverb` : undefined,
      `${artist} ${title} slowed reverb`,
    ].filter(Boolean);
  return [
    "Slowed and Reverbed",
    title,
    `${title} slowed`,
    `${title} reverb`,
    `${title} slowed reverb`,
    ...artists.flatMap(artistTags),
  ].join(", ");
};
