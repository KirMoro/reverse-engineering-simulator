import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import StepIndicator from './StepIndicator';
import CodePanel from './CodePanel';
import TerminalBlock from './TerminalBlock';
import Annotation from './Annotation';

function renderPanel(panel, side, stepId) {
  const panelKey = `${stepId}-${side}`;

  if (panel.kind === 'terminal') {
    return (
      <TerminalBlock
        key={panelKey}
        lines={panel.lines}
        lineDelay={panel.lineDelay}
        panelKey={panelKey}
        title={panel.title}
      />
    );
  }

  return (
    <CodePanel
      filename={panel.filename}
      highlightLines={panel.highlightLines}
      key={panelKey}
      language={panel.language}
      panelKey={panelKey}
      side={side}
      statusText={panel.statusText}
      statusTone={panel.statusTone}
      tooltips={panel.tooltips}
      value={panel.code}
    />
  );
}

export default function Simulator({
  currentStep,
  onSelectStep,
  onStepChange,
  onViewSummary,
  steps,
}) {
  const [mobileView, setMobileView] = useState('left');
  const reduceMotion = useReducedMotion();
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    setMobileView('left');
  }, [currentStep]);

  return (
    <section className="px-6 py-24 lg:px-10" id="simulator">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
            Interactive Lab
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold text-text-primary md:text-5xl">
            Reverse engineering, one attack step at a time
          </h2>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Compare what an attacker sees in an unprotected build versus a hardened
            build, then inspect why each difference changes exploitability.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          <StepIndicator currentStep={currentStep} onSelect={onSelectStep} steps={steps} />

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              key={step.id}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28 }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-muted">
                    Step {step.id}
                  </div>
                  <h3 className="mt-2 font-display text-3xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-text-secondary">
                    {step.subtitle}
                  </p>
                </div>

                <div className="hidden rounded-2xl border border-surface-400/20 bg-surface-700/60 px-4 py-3 text-right font-mono text-xs uppercase tracking-[0.28em] text-text-muted md:block">
                  Protected versus unprotected
                </div>
              </div>

              <div className="matrix-strip">
                <motion.div
                  animate={reduceMotion ? undefined : { x: ['0%', '-45%'] }}
                  className="whitespace-nowrap px-4 py-2"
                  transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
                >
                  JADX • MANIFEST • STRINGS • SMALI PATCH • INTEGRITY CHECK • FRIDA •
                  DEBUGGER DETECTED • JADX • MANIFEST • STRINGS • SMALI PATCH •
                  INTEGRITY CHECK • FRIDA • DEBUGGER DETECTED •
                </motion.div>
              </div>

              <div className="flex gap-3 lg:hidden">
                <button
                  aria-pressed={mobileView === 'left'}
                  className={`flex-1 rounded-xl border px-4 py-3 font-display text-sm font-semibold transition-colors ${
                    mobileView === 'left'
                      ? 'border-danger/30 bg-danger/10 text-danger-light'
                      : 'border-surface-400/30 bg-surface-700/60 text-text-secondary'
                  }`}
                  onClick={() => setMobileView('left')}
                  type="button"
                >
                  Unprotected
                </button>
                <button
                  aria-pressed={mobileView === 'right'}
                  className={`flex-1 rounded-xl border px-4 py-3 font-display text-sm font-semibold transition-colors ${
                    mobileView === 'right'
                      ? 'border-safe/30 bg-safe/10 text-safe-light'
                      : 'border-surface-400/30 bg-surface-700/60 text-text-secondary'
                  }`}
                  onClick={() => setMobileView('right')}
                  type="button"
                >
                  Protected
                </button>
              </div>

              <div className="hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
                {renderPanel(step.left, 'left', step.id)}
                {renderPanel(step.right, 'right', step.id)}
              </div>

              <div className="lg:hidden">
                {mobileView === 'left'
                  ? renderPanel(step.left, 'left', step.id)
                  : renderPanel(step.right, 'right', step.id)}
              </div>

              <Annotation annotation={step.annotation} />
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-4 border-t border-surface-400/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="rounded-xl border border-surface-400/30 bg-surface-700/60 px-5 py-3 font-display text-sm font-semibold text-text-primary transition-colors hover:border-surface-400 hover:bg-surface-600 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentStep === 0}
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              type="button"
            >
              ← Previous Step
            </button>

            <div className="font-mono text-xs uppercase tracking-[0.28em] text-text-muted">
              {step.annotation.riskTag}
            </div>

            <button
              className="rounded-xl bg-accent px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-accent-light"
              onClick={() => {
                if (isLastStep) {
                  onViewSummary();
                  return;
                }

                onStepChange(Math.min(steps.length - 1, currentStep + 1));
              }}
              type="button"
            >
              {isLastStep ? 'View Summary →' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

