import { cn } from "@/lib/utils";

interface PriceOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  emoji: string;
}

interface PriceOptionCardProps {
  option: PriceOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

export function PriceOptionCard({ option, isSelected, onSelect }: PriceOptionCardProps) {
  return (
    <div 
      className={cn(
        "food-card bg-card rounded-xl p-4 shadow-md border-2 border-border/50 cursor-pointer hover:bg-accent/50",
        isSelected && "selected border-primary bg-accent/50"
      )}
      onClick={() => onSelect(option.id)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{option.icon} {option.name}</h3>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </div>
        <div className="text-2xl">{option.emoji}</div>
      </div>
    </div>
  );
}
