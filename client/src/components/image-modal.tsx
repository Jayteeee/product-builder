import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ImageCarousel } from "./image-carousel";
import { X } from "lucide-react";

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
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none flex items-center justify-center overflow-hidden">
        <VisuallyHidden asChild>
          <DialogTitle>{alt} 이미지</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{alt}의 상세 이미지를 확인하세요</DialogDescription>
        </VisuallyHidden>
        
        {/* Custom Close Button for better visibility over dark image background */}
        <div className="absolute top-4 right-4 z-[60]">
          <DialogClose className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors backdrop-blur-sm">
            <X className="h-6 w-6" />
            <span className="sr-only">닫기</span>
          </DialogClose>
        </div>

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