export default function Footer() {
  return (
    <footer className="border-t border-surface-400/20 px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <div>Built as an educational resource for the mobile dev community.</div>
        <div className="font-mono uppercase tracking-[0.24em] text-text-muted/80">
          Dark mode only • static site • no tracking
        </div>
      </div>
    </footer>
  );
}
