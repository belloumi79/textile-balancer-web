export function Header() {
  return (
    <header className="bg-dark-panel border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
            TLB
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Textile Line Balancer</h1>
            <p className="text-xs text-muted">Digital Factory Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted bg-dark-card px-3 py-1 rounded-full">
            🆓 Gratuit & Open Source
          </span>
        </div>
      </div>
    </header>
  );
}
