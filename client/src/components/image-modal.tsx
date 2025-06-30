import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageCarousel } from "./image-carousel";

interface ImageModalProps {
  images: string[];
  alt: string;
  trigger: React.ReactNode;
}

export function ImageModal({ images, alt, trigger }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
        <div className="relative w-full h-[80vh] bg-black/90 rounded-lg overflow-hidden">
          <ImageCarousel 
            images={images} 
            alt={alt} 
            className="h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}