import { motion, useReducedMotion } from 'framer-motion';

const commandStrips = [
  'jadx app-release.apk',
  'apktool d app-release.apk',
  'strings classes.dex | grep secret',
  'frida -U -f com.finpay.app',
];

export default function Hero({ onStart }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-surface-900 bg-hero-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.08),transparent_28%),radial-gradient(circle_at_left_center,rgba(255,68,68,0.1),transparent_24%)]" />

      {commandStrips.map((command, index) => (
        <motion.div
          key={command}
          animate={reduceMotion ? undefined : { x: ['0%', '-8%', '0%'] }}
          className={`pointer-events-none absolute hidden font-mono text-xs uppercase tracking-[0.4em] text-text-muted/20 md:block ${
            index === 0
              ? 'left-8 top-24'
              : index === 1
                ? 'right-12 top-40'
                : index === 2
                  ? 'left-16 bottom-44'
                  : 'right-10 bottom-28'
          }`}
          transition={{
            duration: 14 + index * 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          {command}
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:px-10">
        <div className="max-w-3xl">
          <motion.div
            animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light"
            transition={{ duration: 4, repeat: Infinity }}
          >
            Reverse Engineering Simulator
          </motion.div>

          <motion.h1
            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
            className="font-display text-5xl font-bold leading-[0.94] text-text-primary sm:text-6xl lg:text-7xl"
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            What Hackers See When They
            <span className="block text-danger"> Decompile </span>
            Your App
          </motion.h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary md:text-xl">
            An interactive look at mobile app reverse engineering: protected versus
            unprotected builds, seen through the eyes of an attacker.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              className="rounded-xl bg-accent px-8 py-4 font-display text-base font-semibold text-white shadow-glow-accent transition-all duration-300 hover:bg-accent-light hover:shadow-glow-accent focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-offset-2 focus:ring-offset-surface-900"
              onClick={onStart}
              type="button"
            >
              Start Simulation →
            </button>
            <div className="rounded-xl border border-surface-400/30 bg-surface-700/60 px-5 py-4 text-sm leading-6 text-text-secondary">
              Static educational page. No cookies, no forms, no trackers.
            </div>
          </div>
        </div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          className="relative"
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="code-panel code-panel-unprotected absolute -left-2 top-6 hidden w-44 rotate-[-4deg] border-danger/30 p-4 shadow-glow-danger lg:block">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-danger">
              Unprotected
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs text-text-secondary">
              <div className="rounded-lg bg-danger/10 px-3 py-2 text-danger-light">
                API_KEY visible
              </div>
              <div className="rounded-lg bg-danger/10 px-3 py-2 text-danger-light">
                Hook target named
              </div>
              <div className="rounded-lg bg-danger/10 px-3 py-2 text-danger-light">
                License check patchable
              </div>
            </div>
          </div>

          <div className="terminal relative scanline overflow-hidden rounded-[28px] border border-surface-400/20 bg-surface-700/80 p-0 shadow-panel backdrop-blur">
            <div className="terminal-header px-6 pt-5">
              <span className="terminal-dot bg-danger" />
              <span className="terminal-dot bg-amber-400" />
              <span className="terminal-dot bg-safe" />
              <span className="ml-3 font-mono text-xs uppercase tracking-[0.28em] text-text-muted">
                Attack Preview
              </span>
            </div>

            <div className="grid gap-4 px-6 pb-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4">
                <div className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-danger">
                  Decompiled
                </div>
                <div className="mt-4 space-y-2 font-mono text-sm">
                  <div className="text-syntax-keyword">private static final String</div>
                  <div className="text-syntax-string">"sk_demo_live_example_only"</div>
                  <div className="text-syntax-comment">// readable, reusable, exposed</div>
                </div>
              </div>

              <div className="rounded-2xl border border-safe/20 bg-safe/5 p-4">
                <div className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-safe">
                  Protected
                </div>
                <div className="mt-4 space-y-2 font-mono text-sm">
                  <div className="text-syntax-keyword">private static final String</div>
                  <div className="text-syntax-string">x9c.d(new byte[]&#123;0x7a, ...&#125;)</div>
                  <div className="text-syntax-comment">// runtime-only secret recovery</div>
                </div>
              </div>
            </div>
          </div>

          <div className="code-panel code-panel-protected absolute -right-2 bottom-8 hidden w-44 rotate-[4deg] border-safe/30 p-4 shadow-glow-safe lg:block">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-safe">
              Protected
            </div>
            <div className="mt-3 space-y-2 font-mono text-xs text-text-secondary">
              <div className="rounded-lg bg-safe/10 px-3 py-2 text-safe-light">
                Strings encrypted
              </div>
              <div className="rounded-lg bg-safe/10 px-3 py-2 text-safe-light">
                Integrity enforced
              </div>
              <div className="rounded-lg bg-safe/10 px-3 py-2 text-safe-light">
                Hooking detected
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

