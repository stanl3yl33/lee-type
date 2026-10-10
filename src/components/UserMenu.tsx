"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoPersonOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { authClient } from "@/lib/auth-client";

export default function UserMenu({ name }: { name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    setOpen(false);
    await authClient.signOut();
    router.replace("/"); //redirect to home pg after sign out
    router.refresh();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/account"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 text-correct hover:text-accent transition-colors"
      >
        <IoPersonOutline size={16} />
        {name}
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-10 pt-2">
          <div className="min-w-44 rounded border border-untyped/30 bg-background py-2 shadow-lg">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-untyped hover:text-accent transition-colors w-full text-left"
            >
              <IoStatsChartOutline size={16} />
              account
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-untyped hover:text-accent transition-colors w-full text-left"
            >
              <IoSettingsOutline size={16} />
              settings
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 text-untyped hover:text-accent transition-colors w-full text-left"
            >
              <IoLogOutOutline size={16} />
              sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
