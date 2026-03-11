import { motion, useReducedMotion } from 'framer-motion';
import { highlightLine } from '../utils/syntaxHighlight';

export default function CodePanel({
  filename,
  highlightLines = [],
  language,
  panelKey,
  side,
  statusText,
  statusTone,
  tooltips = {},
  value,
}) {
  const reduceMotion = useReducedMotion();
  const lines = value.split('\n');
  const isLeft = side === 'left';

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`code-panel ${isLeft ? 'code-panel-unprotected' : 'code-panel-protected'}`}
      initial={{ opacity: 0, y: 16 }}
      key={panelKey}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${
          isLeft ? 'border-danger/10' : 'border-safe/10'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isLeft ? 'bg-danger animate-pulse-danger' : 'bg-safe animate-pulse-safe'
            }`}
          />
          <span
            className={`font-display text-sm font-semibold uppercase tracking-[0.22em] ${
              isLeft ? 'text-danger' : 'text-safe'
            }`}
          >
            {isLeft ? 'Unprotected' : 'Protected'}
          </span>
        </div>
        <span className="font-mono text-xs text-text-muted">{filename}</span>
      </div>

      <pre
        aria-label={`${filename} ${isLeft ? 'unprotected' : 'protected'} example`}
        className="overflow-x-auto p-4"
      >
        <code className="block min-w-max">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const tokens = highlightLine(line, language);
            const tooltip = tooltips[lineNumber];
            const activeLine = highlightLines.includes(lineNumber);

            return (
              <motion.span
                animate={{ opacity: 1, x: 0 }}
                className={`group relative grid grid-cols-[auto_1fr] gap-4 px-2 ${
                  activeLine ? (isLeft ? 'line-vulnerable' : 'line-protected') : ''
                } ${tooltip ? 'cursor-help rounded-md' : ''}`}
                initial={{ opacity: 0, x: isLeft ? -8 : 8 }}
                key={`${panelKey}-${lineNumber}`}
                tabIndex={tooltip ? 0 : undefined}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { delay: Math.min(index * 0.018, 0.24), duration: 0.22 }
                }
              >
                <span aria-hidden="true" className="select-none text-right text-text-muted/50">
                  {String(lineNumber).padStart(2, '0')}
                </span>
                <span className="whitespace-pre">
                  {tokens.map((token, tokenIndex) => (
                    <span className={token.className} key={`${lineNumber}-${tokenIndex}`}>
                      {token.text}
                    </span>
                  ))}
                </span>

                {tooltip ? (
                  <span className="pointer-events-none absolute left-16 top-full z-20 hidden max-w-xs rounded-xl border border-surface-400/30 bg-surface-600 px-3 py-2 text-xs leading-5 text-text-secondary shadow-panel group-hover:block group-focus:block">
                    {tooltip}
                  </span>
                ) : null}
              </motion.span>
            );
          })}
        </code>
      </pre>

      {statusText ? (
        <div className="border-t border-surface-400/20 px-4 py-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 font-mono text-xs ${
              statusTone === 'danger'
                ? 'bg-danger/10 text-danger-light'
                : 'bg-safe/10 text-safe-light'
            }`}
          >
            {statusText}
          </span>
        </div>
      ) : null}
    </motion.div>
  );
}

