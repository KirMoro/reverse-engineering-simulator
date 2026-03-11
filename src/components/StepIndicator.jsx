import { motion, useReducedMotion } from 'framer-motion';

export default function StepIndicator({ currentStep, onSelect, steps }) {
  const reduceMotion = useReducedMotion();
  const progress =
    steps.length === 1 ? 100 : (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted">
        <span>Attack Sequence</span>
        <span>
          {String(currentStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-surface-400/40" />
        <motion.div
          animate={{ width: `${progress}%` }}
          className="absolute left-0 top-4 h-px bg-gradient-to-r from-danger via-accent to-safe"
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeInOut' }}
        />

        <div className="relative flex items-start justify-between gap-2">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <button
                key={step.id}
                className="group flex min-w-0 flex-1 flex-col items-center gap-3 text-center"
                onClick={() => onSelect(index)}
                type="button"
              >
                <motion.span
                  animate={
                    isCurrent && !reduceMotion
                      ? { scale: [1, 1.08, 1] }
                      : { scale: 1 }
                  }
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-mono transition-all duration-300 ${
                    isCurrent
                      ? 'border-accent bg-accent text-white shadow-glow-accent'
                      : isComplete
                        ? 'border-safe bg-safe/20 text-safe shadow-glow-safe'
                        : 'border-surface-400 bg-surface-700 text-text-muted'
                  }`}
                  transition={{ duration: 1.4, repeat: isCurrent ? Infinity : 0 }}
                >
                  {index + 1}
                </motion.span>
                <span
                  className={`hidden text-xs leading-5 md:block ${
                    isCurrent ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

