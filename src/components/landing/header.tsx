export function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-foreground">Brandiha</div>
        <nav className="flex items-center gap-6">
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#agenda" className="text-sm text-muted-foreground hover:text-foreground">
            Agenda
          </a>
          <a href="#authors" className="text-sm text-muted-foreground hover:text-foreground">
            Authors
          </a>
        </nav>
      </div>
    </header>
  );
}
