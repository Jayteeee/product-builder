interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mt-3 bg-secondary/30 rounded-full h-2 overflow-hidden">
      <div 
        className="progress-bar bg-primary rounded-full h-2 transition-all duration-500 shadow-[0_0_10px_rgba(71,155,255,0.5)]" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
