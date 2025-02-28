"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  isMultiple?: boolean; // New prop to control if multiple images are allowed
}

const ImageUpload = ({
  value,
  onChange,
  isMultiple = true,
}: ImageUploadProps) => {
  const imagesRef = useRef<string[]>(value || []);

  // Handle image upload based on whether multiple images are allowed
  const onUpload = (url: string) => {
    if (isMultiple) {
      imagesRef.current = [...imagesRef.current, url]; // Append image
    } else {
      imagesRef.current = [url]; // Replace with the new image
    }
    onChange(imagesRef.current); // Update form without re-render
  };

  // Handle image removal
  const onRemove = (url: string) => {
    const updatedImages = value.filter((image) => image !== url);
    imagesRef.current = updatedImages;
    onChange(updatedImages); // Ensure form gets the updated array
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {imagesRef.current.map((url) => (
          <div key={url} className="relative h-[200px] w-[200px]">
            <Image
              src={url}
              fill
              alt="uploaded-image"
              className="object-cover rounded-lg"
            />
            <Button
              className="absolute top-1 right-1 rounded-full"
              variant="destructive"
              size="icon"
              onClick={() => onRemove(url)}
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="myborcella"
        onSuccess={(result: any) => onUpload(result?.info?.secure_url)}
      >
        {({ open }) => (
          <Button
            onClick={() => open()}
            className="bg-gray-1 text-white flex items-center gap-x-2"
            type="button"
          >
            <Plus className="size-4" />
            Upload Image
          </Button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;
