"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload = ({ value, onChange, onRemove }: ImageUploadProps) => {
  const onUpload = (result: any) => {
    onChange(result?.info?.secure_url);
  };
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.length > 0 &&
          value.map((url) => (
            <div key={url} className="relative h-[200px] w-[200px]">
              <Image
                src={url}
                fill
                alt="collection-image"
                className="object-cover rounded-lg"
              />
              <Button className="absolute top-1 right-1 rounded-full" variant={"destructive"} size={"icon"} 
              onClick={()=> onRemove(url)}
              >
                <Trash className="h-5 w-5 "/>
              </Button>
            </div>
          ))}
      </div>
      <CldUploadWidget uploadPreset="myborcella" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button
              onClick={() => open()}
              className="bg-gray-1 text-white flex items-center gap-x-2"
            >
              <Plus className="size-4" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;
