export default function Annotation({ annotation }) {
  return (
    <div className="rounded-2xl border border-surface-400/20 bg-surface-700/60 p-6 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Why this matters
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold text-text-primary">
            {annotation.title}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-danger/10 px-3 py-1 font-mono text-xs text-danger-light">
              {annotation.riskTag}
            </span>
            <span className="rounded-full bg-surface-500 px-3 py-1 font-mono text-xs text-text-muted">
              Unprotected: {annotation.timeToExploit.left}
            </span>
            <span className="rounded-full bg-surface-500 px-3 py-1 font-mono text-xs text-text-muted">
              Protected: {annotation.timeToExploit.right}
            </span>
          </div>
        </div>

        {annotation.highlightStat ? (
          <div className="max-w-md rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm leading-6 text-text-secondary">
            {annotation.highlightStat}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-danger">
            Unprotected
          </div>
          <p className="mt-3 leading-7 text-text-secondary">{annotation.leftText}</p>
        </div>

        <div className="rounded-2xl border border-safe/20 bg-safe/5 p-5">
          <div className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-safe">
            Protected
          </div>
          <p className="mt-3 leading-7 text-text-secondary">{annotation.rightText}</p>
        </div>
      </div>
    </div>
  );
}

