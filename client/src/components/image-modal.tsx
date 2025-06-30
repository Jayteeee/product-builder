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
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
        <VisuallyHidden asChild>
          <DialogTitle>{alt} 이미지</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{alt}의 상세 이미지를 확인하세요</DialogDescription>
        </VisuallyHidden>
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