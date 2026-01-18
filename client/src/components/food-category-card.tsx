import { cn } from "@/lib/utils";

interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface FoodCategoryCardProps {
  category: FoodCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

export function FoodCategoryCard({ category, isSelected, onSelect }: FoodCategoryCardProps) {
  return (
    <div 
      className={cn(
        "food-card bg-card rounded-xl p-4 shadow-md border-2 border-border/50 cursor-pointer hover:bg-accent/50",
        isSelected && "selected border-primary bg-accent/50"
      )}
      onClick={() => onSelect(category.id)}
    >
      <div className="text-center">
        <div className={cn(
          "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-2xl shadow-lg",
          category.color
        )}>
          {category.icon}
        </div>
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
      </div>
    </div>
  );
}
