import { cn } from "@/lib/utils";

interface SpiceLevel {
  id: string;
  name: string;
  icon: string;
  description: string;
  spiceIcon: string;
}

interface SpiceLevelCardProps {
  level: SpiceLevel;
  isSelected: boolean;
  onSelect: (levelId: string) => void;
}

export function SpiceLevelCard({ level, isSelected, onSelect }: SpiceLevelCardProps) {
  return (
    <div 
      className={cn(
        "food-card bg-card rounded-xl p-4 shadow-md border-2 border-border/50 cursor-pointer hover:bg-accent/50",
        isSelected && "selected border-primary bg-accent/50"
      )}
      onClick={() => onSelect(level.id)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{level.icon} {level.name}</h3>
          <p className="text-sm text-muted-foreground">{level.description}</p>
        </div>
        <div className="flex">
          <span className={cn(
            level.id === "mild" && "text-orange-300",
            level.id === "medium" && "text-orange-500", 
            level.id === "hot" && "text-red-500"
          )}>
            {level.spiceIcon}
          </span>
        </div>
      </div>
    </div>
  );
}
