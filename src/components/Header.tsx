"use client";

import Link from "next/link";
import { IoSettingsOutline, IoPersonOutline } from "react-icons/io5";
import UserMenu from "./UserMenu";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="w-full px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center gap-6">
        {/* logo */}
        <Link
          href="/"
          className="text-accent text-lg font-medium tracking-wider"
        >
          lee-type
        </Link>

        {/* center nav icons */}
        <div className="flex items-center gap-4 text-untyped">
          <Link
            href="/settings"
            className="hover:text-accent transition-colors"
          >
            <IoSettingsOutline size={18} />
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm">
          {!isPending &&
            (session ? (
              <UserMenu name={session.user.name} />
            ) : (
              <Link
                href="/login"
                aria-label="sign in"
                className="text-untyped hover:text-accent transition-colors"
              >
                <IoPersonOutline size={16} />
              </Link>
            ))}
        </div>
        <div className="flex items-center gap-4 text-untyped"></div>
      </div>
    </header>
  );
}
