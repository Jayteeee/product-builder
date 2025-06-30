import { X, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PopupAd({ isOpen, onClose }: PopupAdProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
        <div className="text-center">
          <div className="ad-banner h-32 rounded-lg flex items-center justify-center text-gray-500 mb-4">
            <div>
              <Megaphone className="w-8 h-8 mb-2 mx-auto" />
              <p className="text-sm">팝업 광고 영역</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-2" />
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
