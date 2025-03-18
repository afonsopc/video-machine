import { HTMLAttributes, useEffect, useRef, useState } from "react";
import ReactCrop, { type PixelCrop } from "react-image-crop";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cropImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import 'react-image-crop/dist/ReactCrop.css'


type Props = {
  image: Blob;
  onCrop?: (croppedImageBlob: Blob) => void;
  compression?: number;
  type?: string;
} & HTMLAttributes<HTMLDivElement>;

const ImageCrop = ({ image, onCrop, type, compression }: Props) => {
  const [crop, setCrop] = useState<PixelCrop>();
  const [processingImage, setProcessingImage] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (image) setImageUrl(URL.createObjectURL(image));;

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [image]);

  const handleCropClick = async () => {
    if (!crop) return onCrop?.(image);

    setProcessingImage(true);

    let loadingToastId = toast.loading("Processing Image", {
      duration: 100000,
    });

    if (!imageRef.current) {
      setProcessingImage(false);
      console.error("Image ref is not defined");
      toast.error("There has been an error processing the image",
        {
          id: loadingToastId,
          duration: 3,
        },
      );
      return;
    }

    const croppedImageBlob = await cropImage(
      imageRef.current,
      crop,
      compression,
      type,
    ).catch((error) => {
      setProcessingImage(false);
      console.error("Image crop error", error);
      toast.error("There has been an error cropping the image", {
        id: loadingToastId,
        duration: 3,
      });
      return null;
    });

    if (!croppedImageBlob) return;

    toast.success("Image cropped successfully", {
      id: loadingToastId,
      duration: 3,
    });

    onCrop?.(croppedImageBlob);
    setProcessingImage(false);
  };

  const handleCropChange = (crop: PixelCrop) => !processingImage ? setCrop(crop) : () => {};

  return (
    <div className="flex flex-col justify-center gap-2">
      <ReactCrop
        ruleOfThirds
        aspect={1}
        crop={crop}
        onChange={handleCropChange}
      >
        <img className=" w-full rounded-lg" ref={imageRef} src={imageUrl} />
      </ReactCrop>
      <Button
        disabled={processingImage}
        className={cn((processingImage) && "animate-pulse")}
        onClick={handleCropClick}
      >
        Done
      </Button>
    </div>
  );
};

export default ImageCrop;
