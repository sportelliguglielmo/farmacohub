import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  allStepsCompleted: boolean;
  progress: number;
}

export function ProgressStepper({
  currentStep,
  totalSteps,
  allStepsCompleted,
  progress,
}: ProgressStepperProps) {
  return (
    <div className='mb-4 sm:mb-6'>
      <div className='flex items-center justify-between text-xs sm:text-sm mb-2'>
        <span className='font-medium'>
          {allStepsCompleted
            ? `Completato (${totalSteps} step)`
            : `Passo ${currentStep} di ${totalSteps}`}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className='w-full h-2.5 bg-muted rounded-full overflow-hidden'>
        <div
          className='h-full bg-primary transition-all duration-500 ease-in-out'
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className='flex items-center justify-between mt-3 text-xs sm:text-sm'>
        <div className='flex items-center gap-2'>
          {currentStep > 1 ? (
            <CheckCircle2 className='w-4 h-4 text-primary' />
          ) : (
            <Circle className='w-4 h-4' />
          )}
          <span
            className={cn('font-medium', currentStep > 1 ? 'text-primary' : '')}
          >
            Patologia
          </span>
        </div>
        <div className='flex items-center gap-2'>
          {currentStep > 2 ? (
            <CheckCircle2 className='w-4 h-4 text-primary' />
          ) : (
            <Circle className='w-4 h-4 ' />
          )}
          <span
            className={cn('font-medium', currentStep > 2 ? 'text-primary' : '')}
          >
            Principio Attivo
          </span>
        </div>
        {totalSteps === 3 && (
          <div className='flex items-center gap-2'>
            {allStepsCompleted ? (
              <CheckCircle2 className='w-4 h-4 text-primary' />
            ) : (
              <Circle className='w-4 h-4 ' />
            )}
            <span
              className={cn(
                'font-medium',
                allStepsCompleted ? 'text-primary' : ''
              )}
            >
              Forma
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
