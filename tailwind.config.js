/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#06060a',
          800: '#0a0a0f',
          700: '#10101a',
          600: '#16162a',
          500: '#1e1e35',
          400: '#2a2a45',
        },
        danger: {
          DEFAULT: '#ff4444',
          light: '#ff6b6b',
          dim: '#ff444433',
          glow: '#ff444422',
        },
        safe: {
          DEFAULT: '#00ff88',
          light: '#33ffaa',
          dim: '#00ff8833',
          glow: '#00ff8822',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dim: '#8b5cf633',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
          code: '#c4b5fd',
        },
        syntax: {
          keyword: '#c792ea',
          string: '#c3e88d',
          number: '#f78c6c',
          comment: '#546e7a',
          function: '#82aaff',
          type: '#ffcb6b',
          operator: '#89ddff',
          tag: '#f07178',
          attr: '#ffcb6b',
          attrValue: '#c3e88d',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        'code-sm': ['0.8125rem', { lineHeight: '1.625' }],
        'code-base': ['0.875rem', { lineHeight: '1.7' }],
      },
      boxShadow: {
        'glow-danger': '0 0 20px 0 rgba(255, 68, 68, 0.15)',
        'glow-safe': '0 0 20px 0 rgba(0, 255, 136, 0.15)',
        'glow-accent': '0 0 20px 0 rgba(139, 92, 246, 0.2)',
        panel: '0 4px 24px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        noise:
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-danger': 'pulse-danger 2s ease-in-out infinite',
        'pulse-safe': 'pulse-safe 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        scanline: 'scanline 8s linear infinite',
        blink: 'blink 1s step-end infinite',
        glitch: 'glitch 0.3s ease-in-out',
      },
      keyframes: {
        'pulse-danger': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 68, 68, 0)' },
          '50%': { boxShadow: '0 0 12px 2px rgba(255, 68, 68, 0.3)' },
        },
        'pulse-safe': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 136, 0)' },
          '50%': { boxShadow: '0 0 12px 2px rgba(0, 255, 136, 0.2)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
};

