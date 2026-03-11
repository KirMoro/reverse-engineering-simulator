import { motion, useReducedMotion } from 'framer-motion';

export default function Summary({
  actionItems,
  faqs,
  metrics,
  onRunAgain,
  openSourceTools,
  resources,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-6 pb-24 pt-8 lg:px-10" id="summary">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-safe-light">
            Mobile App Security Summary
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold text-text-primary md:text-5xl">
            Why mobile app protection changes reverse engineering outcomes
          </h2>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Mobile app reverse engineering does not disappear after release. The goal is
            to make app decompilation, code tampering, and runtime hooking expensive,
            noisy, and unreliable enough that opportunistic attacks stop being viable.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col rounded-2xl border border-surface-400/20 bg-surface-700/70 p-5 shadow-panel"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
              key={metric.label}
              transition={reduceMotion ? { duration: 0 } : { delay: index * 0.05, duration: 0.24 }}
            >
              <div className="min-h-[3.5rem] text-[11px] font-mono uppercase tracking-[0.28em] text-text-muted">
                {metric.label}
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-danger">
                    Unprotected
                  </div>
                  <div className="mt-2 text-sm font-medium text-text-primary">{metric.left}</div>
                </div>
                <div className="rounded-xl border border-safe/20 bg-safe/5 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-safe">
                    Protected
                  </div>
                  <div className="mt-2 text-sm font-medium text-text-primary">{metric.right}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div>
            <h3 className="font-display text-2xl font-semibold text-text-primary">
              How to protect a mobile app from reverse engineering
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {actionItems.map((item, index) => (
                <div
                  className="rounded-2xl border border-surface-400/20 bg-surface-700/70 p-5"
                  key={item.title}
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-mono text-xs text-accent-light">
                    0{index + 1}
                  </div>
                  <h4 className="mt-4 font-display text-lg font-semibold text-text-primary">
                    {item.title}
                  </h4>
                  <p className="mt-3 leading-7 text-text-secondary">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-surface-400/20 bg-surface-700/70 p-6 shadow-panel">
            <h3 className="font-display text-2xl font-semibold text-text-primary">
              Now that you&apos;ve used this reverse engineering simulator, how exposed is
              your mobile app?
            </h3>
            <p className="mt-4 leading-7 text-text-secondary">
              Use these open mobile app security resources to turn this walkthrough into
              an engineering checklist:
            </p>
            <div className="mt-6 space-y-4">
              {resources.map((resource) => (
                <a
                  className="block rounded-2xl border border-surface-400/20 bg-surface-800/80 p-4 transition-colors hover:border-accent/30 hover:bg-surface-700"
                  href={resource.href}
                  key={resource.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="font-display text-base font-semibold text-text-primary">
                    {resource.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-text-secondary">
                    {resource.description}
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Or inspect your own binary with open-source tools like{' '}
              <span className="text-text-primary">{openSourceTools.join(', ')}</span>.
            </p>
            <button
              className="mt-8 rounded-xl bg-accent px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-accent-light"
              onClick={onRunAgain}
              type="button"
            >
              Run Again →
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-2xl font-semibold text-text-primary">
            Frequently asked questions about mobile app reverse engineering
          </h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div
                className="rounded-2xl border border-surface-400/20 bg-surface-700/70 p-5"
                key={faq.question}
              >
                <h4 className="font-display text-lg font-semibold text-text-primary">
                  {faq.question}
                </h4>
                <p className="mt-3 leading-7 text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
