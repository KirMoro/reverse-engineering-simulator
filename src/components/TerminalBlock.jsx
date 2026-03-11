import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { highlightLine } from '../utils/syntaxHighlight';

function lineClass(kind) {
  if (kind === 'found') {
    return 'text-danger-light';
  }

  if (kind === 'success') {
    return 'text-safe-light';
  }

  if (kind === 'error') {
    return 'text-danger-light animate-glitch';
  }

  if (kind === 'warn') {
    return 'text-amber-300';
  }

  if (kind === 'prompt') {
    return 'text-safe-light';
  }

  if (kind === 'status') {
    return 'text-text-primary';
  }

  return 'text-text-secondary';
}

export default function TerminalBlock({ lines, lineDelay = 240, panelKey, title }) {
  const reduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? lines.length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCount(lines.length);
      return undefined;
    }

    setVisibleCount(0);
    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= lines.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, lineDelay);

    return () => window.clearInterval(interval);
  }, [lineDelay, lines.length, panelKey, reduceMotion]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="terminal relative scanline overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      key={panelKey}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
    >
      <div className="terminal-header">
        <span className="terminal-dot bg-danger" />
        <span className="terminal-dot bg-amber-400" />
        <span className="terminal-dot bg-safe" />
        <span className="ml-3 font-mono text-xs uppercase tracking-[0.28em] text-text-muted">
          {title}
        </span>
      </div>

      <div aria-live="polite" className="space-y-1">
        {lines.slice(0, visibleCount).map((line, index) => {
          const tokens = line.language ? highlightLine(line.text, line.language) : null;

          return (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className={`whitespace-pre-wrap break-words ${lineClass(line.kind)} ${
                line.kind === 'found' ? 'animate-glitch' : ''
              }`}
              initial={{ opacity: 0, x: -8 }}
              key={`${panelKey}-${index}`}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.16 }}
            >
              {line.kind === 'blank' ? (
                <span className="opacity-0">.</span>
              ) : tokens ? (
                tokens.map((token, tokenIndex) => (
                  <span className={token.className} key={`${index}-${tokenIndex}`}>
                    {token.text}
                  </span>
                ))
              ) : (
                line.text
              )}
            </motion.div>
          );
        })}

        <div className="pt-2 font-mono text-xs text-safe">
          <span className="cursor-blink" />
        </div>
      </div>
    </motion.div>
  );
}

