import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-4 bg-black/95 border-none">
        <VisuallyHidden asChild>
          <DialogTitle>{alt} 이미지</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{alt}의 상세 이미지를 확인하세요</DialogDescription>
        </VisuallyHidden>
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <ImageCarousel 
            images={images} 
            alt={alt} 
            className="w-full h-full bg-transparent modal-image"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}