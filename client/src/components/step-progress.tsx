interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
      <div 
        className="progress-bar bg-white rounded-full h-2 transition-all duration-500" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
