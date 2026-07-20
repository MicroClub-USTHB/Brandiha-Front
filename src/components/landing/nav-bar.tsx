import Link from "next/link";

export function NavBar() {
  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="text-sm text-white/70 hover:text-white">
        Home
      </Link>
      <a href="#about" className="text-sm text-white/70 hover:text-white">
        About
      </a>
      <a href="#agenda" className="text-sm text-white/70 hover:text-white">
        Agenda
      </a>
      <a href="#authors" className="text-sm text-white/70 hover:text-white">
        Authors
      </a>
    </nav>
  );
}
