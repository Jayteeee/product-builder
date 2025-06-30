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
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none flex items-center justify-center">
        <VisuallyHidden asChild>
          <DialogTitle>{alt} 이미지</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{alt}의 상세 이미지를 확인하세요</DialogDescription>
        </VisuallyHidden>
        <div className="w-full h-[85vh] flex items-center justify-center">
          <ImageCarousel 
            images={images} 
            alt={alt} 
            className="w-full h-full bg-black modal-image flex items-center justify-center"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}