"use client";

import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";

export default function Header() {
  return (
    <header className="w-full px-8 py-4 font-mono">
      <div className="max-w-5xl mx-auto flex items-center gap-6">
        {/* logo */}
        <Link
          href="/"
          className="text-accent text-lg font-medium tracking-wider"
        >
          lee-type
        </Link>

        {/* center nav icons — more added as features are built */}
        <div className="flex items-center gap-4 text-untyped">
          <Link
            href="/settings"
            className="hover:text-accent transition-colors"
          >
            <IoSettingsOutline size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
